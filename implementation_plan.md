# Implementation Plan - WatermelonDB Integration for RoadVet (Expo SDK 57)

This plan outlines the architecture, database schema, setup steps, and cross-platform strategies (Web vs Android Emulator/Phone) for implementing **WatermelonDB** in the RoadVet project.

---

## 1. WatermelonDB Concepts for Beginners

WatermelonDB is a high-performance reactive database framework for React Native and Web apps, optimized for handling thousands of records while keeping the UI running at 60 FPS.

### Core Architecture Concepts
1. **Schema (`appSchema` & `tableSchema`)**: The blueprint defining tables and column types (string, number, boolean). WatermelonDB is strictly typed.
2. **Models (`Model`)**: JS/TS classes representing rows in a table. Attributes and relationships are declared using decorators (`@field`, `@text`, `@date`, `@relation`, `@children`).
3. **Database Adapter**: The engine that handles SQL/storage commands:
   - **Native (Android/iOS)**: Uses `SQLiteAdapter` for fast C++/JSI SQLite performance.
   - **Web**: Uses `LokiJSAdapter` for in-browser IndexedDB storage.
4. **Database Instance (`Database`)**: The central object instantiated with models and the adapter to perform operations.
5. **Observables & Reactivity**: WatermelonDB components automatically re-render when underlying database records change using `@nozbe/with-observables` or RxJS hooks.

---

## 2. Database Entities & Relationship Design

Based on the existing forms (`TutorForm.tsx`, `PetForm.tsx`, `prontuarios/new.tsx`) and application requirements, here is the relational database structure.

```mermaid
erdiagram
    TUTORES ||--o{ PETS : "possui (1:N)"
    PETS ||--o{ PRONTUARIOS : "possui (1:N)"
    PRONTUARIOS ||--o{ ANEXOS_PRONTUARIO : "contém (1:N)"
    VETERINARIOS ||--o{ PRONTUARIOS : "atende (1:N)"

    TUTORES {
        string id PK
        string nome_completo
        string cpf
        number data_nascimento
        string email
        string cep
        string endereco
        string numero
        string bairro
        string complemento
        string cidade
        string uf
        string telefone1
        string telefone2
        string avatar_url
        number created_at
        number updated_at
    }

    PETS {
        string id PK
        string tutor_id FK
        string nome
        number data_nascimento
        string peso
        string especie
        string raca
        string avatar_url
        number created_at
        number updated_at
    }

    PRONTUARIOS {
        string id PK
        string pet_id FK
        string veterinario_id FK
        number date
        string weight
        string temperature
        string heart_rate
        string anamnesis
        string physical_exam
        string prescription
        string exam_request_notes
        string exam_results_notes
        number created_at
        number updated_at
    }

    ANEXOS_PRONTUARIO {
        string id PK
        string prontuario_id FK
        string file_type "request | result"
        string file_name
        string uri
        string mime_type
        number created_at
        number updated_at
    }

    VETERINARIOS {
        string id PK
        string nome
        string crmv
        string email
        string senha_hash
        string telefone
        number created_at
        number updated_at
    }
```

### Table Breakdown

1. **`tutores`** (Customer / Owner data)
   - Schema Fields: `nome_completo`, `cpf`, `data_nascimento` (timestamp), `email`, `cep`, `endereco`, `numero`, `bairro`, `complemento`, `cidade`, `uf`, `telefone1`, `telefone2`, `avatar_url`, `created_at`, `updated_at`.
   - Relations: `@children('pets')`

2. **`pets`** (Animals)
   - Schema Fields: `tutor_id`, `nome`, `data_nascimento` (timestamp), `peso`, `especie`, `raca`, `avatar_url`, `created_at`, `updated_at`.
   - Relations: `@relation('tutores', 'tutor_id')`, `@children('prontuarios')`

3. **`prontuarios`** (Medical Records / Consultations)
   - Schema Fields: `pet_id`, `veterinario_id`, `date` (timestamp), `weight`, `temperature`, `heart_rate`, `anamnesis`, `physical_exam`, `prescription`, `exam_request_notes`, `exam_results_notes`, `created_at`, `updated_at`.
   - Relations: `@relation('pets', 'pet_id')`, `@relation('veterinarios', 'veterinario_id')`, `@children('anexos_prontuario')`

4. **`anexos_prontuario`** (Suggested Table: Exam Requests & Results File Attachments)
   - Schema Fields: `prontuario_id`, `file_type` (`'request'` or `'result'`), `file_name`, `uri`, `mime_type`, `created_at`, `updated_at`.
   - Relations: `@relation('prontuarios', 'prontuario_id')`

5. **`veterinarios`** (Veterinarian User Profile & Auth)
   - Schema Fields: `nome`, `crmv`, `email`, `senha_hash` (stored securely / hashed for offline auth verification), `telefone`, `created_at`, `updated_at`.
   - Relations: `@children('prontuarios')`
   - *Security Note*: Never store plaintext passwords. Store hashed passwords (e.g. bcrypt/argon2) for offline auth or use `expo-secure-store` for sensitive session JWT tokens.

---

## 3. Environment & Compatibility Setup (Expo SDK 57)

### Necessary Packages
```bash
npm install @nozbe/watermelondb @nozbe/with-observables
npm install --save-dev @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
```

### Configuration Requirements

1. **`babel.config.js`**: Add decorator support required by WatermelonDB models.
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
  };
};
```

2. **`tsconfig.json`**: Enable experimental decorators for TypeScript.
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 4. Multi-Platform Database Adapter Strategy (Web + Android)

To seamlessly switch between Web and Android without code changes in screens:

Create `src/database/index.ts`:

```typescript
import { Platform } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';

import { schema } from './schema';
import { Tutor } from './models/Tutor';
import { Pet } from './models/Pet';
import { Prontuario } from './models/Prontuario';
import { AnexoProntuario } from './models/AnexoProntuario';
import { Veterinario } from './models/Veterinario';

const modelClasses = [Tutor, Pet, Prontuario, AnexoProntuario, Veterinario];

function createAdapter() {
  if (Platform.OS === 'web') {
    return new LokiJSAdapter({
      schema,
      useWebWorker: false,
      useIncrementalIndexedDB: true,
      onQuotaExceededError: (error) => {
        console.warn('Storage quota exceeded on web:', error);
      },
    });
  }

  return new SQLiteAdapter({
    schema,
    jsi: true, // Native JSI SQLite execution
    onSetUpError: (error) => {
      console.error('Database failed to load on native:', error);
    },
  });
}

export const database = new Database({
  adapter: createAdapter(),
  modelClasses,
});
```

---

## 5. Development Steps: Running on Web vs Android Device/Emulator

### Option A: Developing on Web (`npm run web`)
> [!TIP]
> Developing on the Web is faster for prototyping UI and forms because hot-reloading is instantaneous.

1. Run `npx expo start --web` or `npm run web`.
2. WatermelonDB will initialize `LokiJSAdapter` automatically using IndexedDB in your browser.
3. Use browser DevTools (Application > IndexedDB) to inspect local data.

### Option B: Developing on Android Emulator / Physical Device
> [!IMPORTANT]
> **Expo Go DOES NOT work with WatermelonDB native SQLite**, because WatermelonDB uses custom native C++ code (JSI). You MUST build a **Development Build** (`expo-dev-client`).

#### Steps to setup Android Development Build:
1. Install `expo-dev-client`:
   ```bash
   npx expo install expo-dev-client
   ```
2. Generate the native `android` directory using Expo Prebuild:
   ```bash
   npx expo prebuild
   ```
3. Launch on Android Emulator or Physical Phone (with USB Debugging turned on):
   ```bash
   npx expo run:android
   ```
4. Metro bundler will connect to your Development Build app on the phone/emulator.

---

## 6. Switching Web <-> Android: Problems & Solutions Checklist

| Potential Problem | Root Cause | Recommended Solution |
| :--- | :--- | :--- |
| **Crash on Web: "Native module not found / SQLiteAdapter failed"** | `SQLiteAdapter` tries to import native C++ SQLite code on Web. | Wrap adapter creation with `Platform.OS === 'web'` to instantiate `LokiJSAdapter` instead of `SQLiteAdapter`. |
| **Crash on Android Expo Go: "Unhandled JS Exception: Native module WatermelonDB is null"** | Expo Go does not contain WatermelonDB's native SQLite C++ libraries. | Switch from Expo Go to an Expo **Development Build** using `npx expo run:android`. |
| **Babel Syntax Error: "Decorators are not supported"** | TypeScript/Babel compiler doesn't recognize `@field` or `@relation`. | Add `@babel/plugin-proposal-decorators` (legacy: true) in `babel.config.js` and `"experimentalDecorators": true` in `tsconfig.json`. |
| **Data in Web DB does not appear on Android Phone** | WatermelonDB stores data locally inside the browser's IndexedDB on Web, and inside SQLite file on Android. | Local offline databases are isolated per device. To sync between Web and Android, implement a WatermelonDB Backend Sync Server (using `synchronize()`). |
| **File attachments (`file://` paths) broken on Web** | Android uses `file:///data/...` local filesystem URIs, whereas Web browser uses `blob:` or Base64. | Abstract attachment storage so web stores object URLs/base64 strings and native uses `expo-file-system`. |
| **Date field bugs / invalid date** | WatermelonDB `@date` field expects standard Unix timestamps (milliseconds integer). | Always pass `date.getTime()` or integer numbers into `@date` fields. |

---

## Proposed Technical Changes

### [Component Name] Database Core Infrastructure

#### [NEW] [schema.ts](file:///home/jfribeiro/projects/roadvet-frontend/src/database/schema.ts)
- Define `appSchema` with version 1 and table specifications (`tutores`, `pets`, `prontuarios`, `anexos_prontuario`, `veterinarios`).

#### [NEW] [models/Tutor.ts](file:///home/jfribeiro/projects/roadvet-frontend/src/database/models/Tutor.ts)
- WatermelonDB Model for Tutor with fields, timestamps, and `@children('pets')`.

#### [NEW] [models/Pet.ts](file:///home/jfribeiro/projects/roadvet-frontend/src/database/models/Pet.ts)
- WatermelonDB Model for Pet with fields, `@relation('tutores', 'tutor_id')`, and `@children('prontuarios')`.

#### [NEW] [models/Prontuario.ts](file:///home/jfribeiro/projects/roadvet-frontend/src/database/models/Prontuario.ts)
- Model for Prontuario with fields, `@relation('pets', 'pet_id')`, `@relation('veterinarios', 'veterinario_id')`, and `@children('anexos_prontuario')`.

#### [NEW] [models/AnexoProntuario.ts](file:///home/jfribeiro/projects/roadvet-frontend/src/database/models/AnexoProntuario.ts)
- Model for attached exam requests/results files.

#### [NEW] [models/Veterinario.ts](file:///home/jfribeiro/projects/roadvet-frontend/src/database/models/Veterinario.ts)
- Model for Vet user details and authentication credentials (`senha_hash`, `email`, `crmv`).

#### [NEW] [index.ts](file:///home/jfribeiro/projects/roadvet-frontend/src/database/index.ts)
- Dynamic Database initialization selecting `LokiJSAdapter` for Web and `SQLiteAdapter` for Android/iOS.

#### [MODIFY] [babel.config.js](file:///home/jfribeiro/projects/roadvet-frontend/babel.config.js)
#### [MODIFY] [tsconfig.json](file:///home/jfribeiro/projects/roadvet-frontend/tsconfig.json)
#### [MODIFY] [package.json](file:///home/jfribeiro/projects/roadvet-frontend/package.json)

---

## Verification Plan

### Automated Tests
- Run TypeScript type checks (`npx tsc --noEmit`) to verify decorator typing.
- Run `npm run lint` / `npx expo lint`.

### Manual Verification
- **Web Verification**: Start with `npm run web`, create a Tutor, Pet, and Prontuário record. Verify persistence across page refreshes in browser IndexedDB.
- **Android Verification**: Run `npx expo run:android` on Android Emulator / Physical device. Create records and verify offline SQLite persistence across app restarts.
