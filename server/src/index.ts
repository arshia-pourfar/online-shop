import express from 'express';

const app = express();
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Order Shop API is running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
}); 