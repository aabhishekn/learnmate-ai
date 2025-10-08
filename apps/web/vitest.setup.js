// Setup file for Vitest to support React Testing Library and Jest mocks
import '@testing-library/jest-dom';
import { vi } from 'vitest';
global.jest = vi;
