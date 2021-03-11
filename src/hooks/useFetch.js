import {useState, useEffect} from 'react';
import axios from 'axios';

const useFetch = (query, page) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [synths, setSynths] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setSynths([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: 'https://synthesizer-api.herokuapp.com/api/synths',
      params: {
        manufacturer: query,
        offset: 0 + 20 * page,
        limit: 20,
        key: `${process.env.REACT_APP_API_KEY}`,
      },
      cancelToken: new axios.CancelToken(
        (cancelToken) => (cancel = cancelToken)
      ),
    })
      .then((res) => {
        setSynths((prevSynths) => {
          return [...prevSynths, ...res.data.synths];
        });
        setHasMore(synths.length + res.data.synths.length < res.data.count);
        setLoading(false);
        // console.log('data', res.data);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, page]);
  return {loading, error, synths, hasMore};
};

export default useFetch;
