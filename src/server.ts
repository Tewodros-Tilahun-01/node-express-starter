import app from './app';
import config from './config';

const PORT: number = config.port || 3000;

app.listen(PORT, (): void => {
  // biome-ignore lint/suspicious/noConsole: <>
  console.log(`Server running on port ${PORT}`);
});
