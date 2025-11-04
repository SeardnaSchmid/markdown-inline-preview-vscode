// Mock for vscode module in Jest tests
export const window = {
  createTextEditorDecorationType: jest.fn(),
};

export const workspace = {
  onDidChangeTextDocument: jest.fn(),
};

export const ThemeColor = jest.fn();

export default {
  window,
  workspace,
  ThemeColor,
};
