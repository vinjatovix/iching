import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';
import i18n from '../src/i18n';

// Asegurar idioma español por defecto en el entorno de pruebas
beforeEach(() => {
  i18n.changeLanguage('es');
});
