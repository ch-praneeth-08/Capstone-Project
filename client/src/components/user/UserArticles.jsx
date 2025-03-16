import { useState, useEffect } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '@clerk/clerk-react'


function UserArticles() {

  const [articles, setArticles] = useState([])
  const [error, setError] = useState('')
  const [filteredArticles, setFilteredArticles] = useState([]);
  const navigate=useNavigate()
  const {getToken}=useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  //get all articles
  async function getArticles() {
    //get jwt token
    const token=await getToken()
    //make authenticated req
    let res = await axios.get('http://localhost:3000/user-api/articles',{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    if (res.data.message === 'articles') {
      setArticles(res.data.payload)
      extractCategories(res.data.payload);
      setFilteredArticles(res.data.payload);
      setError('')
    } else {
      setError(res.data.message)
    }
  }

  //goto specific article
  function gotoArticleById(articleObj){
      navigate(`../${articleObj.articleId}`,{ state:articleObj})
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
  useEffect(() => {
    getArticles()
  }, [])

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
      <div>
      {error.length!==0&&<p className='display-4 text-center mt-5 text-danger'>{error}</p>}
        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 '>
          {
            filteredArticles.map((articleObj) => <div className='col' key={articleObj.articleId}>
              <div className="card h-100">
                <div className="card-body">
                {/* author image  */}
                  <div className="author-details text-end">
                    <img src={articleObj.authorData.profileImageUrl}
                      width='40px'
                      className='rounded-circle'
                      alt="" />
                    {/* author name */}
                    <p>
                      <small className='text-secondary'>
                        {articleObj.authorData.nameOfAuthor}
                      </small>
                    </p>
                  </div>
                  {/* article title */}
                  <h5 className='card-title'>{articleObj.title}</h5>
                  {/* article content upadto 80 chars */}
                  <p className='card-text'>
                    {articleObj.content.substring(0, 80) + "...."}
                  </p>
                  {/* read more button */}
                  <button className='custom-btn btn-4' onClick={()=>gotoArticleById(articleObj)}>
                    Read more
                  </button>
                </div>
                <div className="card-footer">
                {/* article's date of modification */}
                  <small className="text-body-secondary">
                    Last updated on {articleObj.dateOfModification}
                  </small>
                </div>
              </div>
            </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default UserArticles
