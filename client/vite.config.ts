import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // so you can import without the extension
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.jsx', '.json']
  }
});
