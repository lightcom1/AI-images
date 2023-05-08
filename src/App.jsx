import { useState } from 'react';
import s from './app.module.scss';

function App() {
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const api = import.meta.env.VITE_API_KEY;

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const getImages = async () => {
    try {
      setIsLoading(true);
      setSearch('');
      setImages([]);

      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${api}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: search,
          n: 4,
          size: '1024x1024',
        }),
      };

      const response = await fetch(
        'https://api.openai.com/v1/images/generations',
        options
      );

      const data = await response.json();
      console.log('data: ', data);

      if (response.status === 200) {
        setImages(data.data);
        setError('');
        setIsLoading(false);
      } else {
        setError(data?.error.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('eer', error);
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      getImages();
    }
  };

  return (
    <main>
      <section className={s.inputWrapper}>
        <input
          disabled={isLoading}
          value={search}
          onChange={handleChange}
          onKeyDown={handleEnter}
          type='text'
        />
        <button disabled={isLoading || search.lenght < 1} onClick={getImages}>
          Submit
        </button>
      </section>
      {error && <p className={s.error}>{error}</p>}
      <section className={s.section}>
        {images?.map((el, i) => (
          <div className={s.imgWrapper} key={i}>
            <img src={el.url} alt='ai' />
          </div>
        ))}
      </section>
    </main>
  );
}

export default App;
