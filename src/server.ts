import app from './app';
import config from './config';

const PORT: number = config.port || 3000;

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});
