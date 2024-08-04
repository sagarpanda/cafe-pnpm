# Cafe

It's a monorepo using `pnpm` workspace

## Installation

```sh
pnpm install
```

## Development

```sh
# @cafe/react
cd package/react
# build @cafe/react
pnpm run build
# build @cafe/react (watch mode)
pnpm run build --watch
# build from root directory
pnpm --filter @cafe/react run build

# @cafe/demo-app
cd apps/demo-app
# start app
pnpm run dev
# build app
pnpm run build
# build from root directory
pnpm --filter @cafe/demo-app run build

# add a devDependency in @cafe/react
cd package/react
pnpm add @types/node -D
# same command for local dependency (e.g. in @cafe/demo-app)
cd apps/demo-app
pnpm add @cafe/react

# build all
pnpm --filter "@cafe/*" build

# Add new react app in apps folder
cd apps
pnpm create vite demo-app
```

## How to create pnpm workspace

```sh
mkdir monorepo
cd monorepo
# generate package.json
npm init -y
# change the package name to @cafe/monorepo (optional)
npm pkg set name=@cafe/monorepo

# add attribute workspaces to package.json (Ref snippet below)
# { "workspaces": ["apps/**", "packages/**"] }
# create pnpm-workspace.yaml and refer the snippet below
vi pnpm-workspace.yaml

# create apps and packages folder
mkdir apps
mkdir packages
```

#### package.json

```json
{
  "name": "@cafe/monorepo",
  "version": "1.0.0",
  "description": "",
  "workspaces": ["apps/**", "packages/**"],
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

#### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/**'
  - 'apps/**'
```

#### .prettierrc.json

```json
{
  "trailingComma": "none",
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true
}
```

#### .vscode/settings.json

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": false,
  "prettier.useEditorConfig": false,
  "prettier.useTabs": false,
  "prettier.configPath": ".prettierrc.json"
}
```

## How to create react component library using vite

```sh
cd packages
pnpm create vite ui
cd ui
npm pkg set name=@cafe/ui
# delete unused files and folders
rm -rf public src
rm index.html

# create src folder
mkdir src
echo "/// <reference types="vite/client" />" >> src/vite-env.d.ts
## create files src/index.ts and src/Button.tsx

# move content from tsconfig.app.json to tsconfig.json
mv tsconfig.app.json tsconfig.json

# update vite.config.ts

# add "vite-plugin-dts": "^3.9.1" as devDependency in package.json
```

#### src/Button.tsx

```tsx
import { ReactNode } from 'react';

export type ButtonProps = {
  children: ReactNode;
};

export const Button = (props: ButtonProps) => {
  return <button {...props} />;
};
```

#### src/index.ts

```ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

#### vite.config.ts

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CafeReact',
      // the proper extensions will be added
      fileName: 'cafe-react'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react/jsx-runtime', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'react',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime'
        }
      }
    },
    emptyOutDir: true
  }
});
```

## How to create react app using vite

```sh
cd apps
pnpm create vite demo-ui
cd demo-ui
pnpm add @cafe/ui # if you want to add dependency @cafe/ui
```
