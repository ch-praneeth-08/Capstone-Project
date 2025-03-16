import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { getToken } = useAuth();

  async function getArticles() {
    try {
      const token = await getToken();
      let res = await axios.get('http://localhost:3000/author-api/articles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.message === 'articles') {
        setArticles(res.data.payload);
        setFilteredArticles(res.data.payload);
        setError('');
        extractCategories(res.data.payload);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch articles');
    }
  }

  function extractCategories(articles) {
    const uniqueCategories = ['all', ...new Set(articles.map(article => article.category))];
    setCategories(uniqueCategories);
  }

  function filterArticles(category) {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.category === category));
    }
  }

  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div className='container'>
      <div className='mb-4'>
        <label htmlFor='categorySelect' className='form-label'>Select Category:</label>
        <select
          id='categorySelect'
          className='form-select'
          value={selectedCategory}
          onChange={(e) => filterArticles(e.target.value)}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      {error && <p className='display-4 text-center mt-5 text-danger'>{error}</p>}
      
      <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3'>
        {filteredArticles.map((articleObj) => (
          <div className='col' key={articleObj.articleId}>
            <div className='card h-100'>
              <div className='card-body'>
                <div className='author-details text-end'>
                  <img src={articleObj.authorData.profileImageUrl} width='40px' className='rounded-circle' alt='' />
                  <p><small className='text-secondary'>{articleObj.authorData.nameOfAuthor}</small></p>
                </div>
                <h5 className='card-title'>{articleObj.title}</h5>
                <p className='card-text'>{articleObj.content.substring(0, 80) + '....'}</p>
                <button className='custom-btn btn-4' onClick={() => gotoArticleById(articleObj)}>
                  Read more
                </button>
              </div>
              <div className='card-footer'>
                <small className='text-body-secondary'>Last updated on {articleObj.dateOfModification}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Articles;
