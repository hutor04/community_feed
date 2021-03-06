import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import Card from '../components/Card/Card';

const FeedWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin: 5%;
`;

const Alert = styled.div`
  text-align: center;
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const PaginationBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const PaginationLink = styled(Link)`
  padding: 1%;
  background: lightBlue;
  color: white;
  text-decoration: none
  border-radius: 5px;
 `;

const ROOT_API = 'https://api.stackexchange.com/2.2/';

const Feed = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.page) {
      setPage(parseInt(query.page));
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch(
          `${ROOT_API}questions?order=desc&sort=activity&tagged=reactjs&site=stackoverflow${(page) ? `&page=${page}` : ''}`,);
        const dataJSON = await data.json();
        setData(dataJSON);
        setLoading(false);
        setError(false);
      } catch (err) {
        setLoading(false);
        setError(true);
      }
    };
      fetchData();
  }, [page]);

  if (loading || error) {
    return (
      <>
        <Helmet>
        <title>Q&A Feed - Questions</title>
        </Helmet>
        <Alert>{loading ? 'Loading...' : error}</Alert>
      </>
    );
  }

  return (
    <FeedWrapper>
      {data.items.map(item => (
        <CardLink key={item.question_id} to={`/questions/${item.question_id}`} >
          <Card key={item.question_id} data={item} />
        </CardLink>
      ))}
      <PaginationBar>
        {page > 1 && <PaginationLink to={`${location.pathname}?page=${page - 1}`}>Previous</PaginationLink>}
        {data.has_more && <PaginationLink to={`${location.pathname}?page=${page + 1}`}>Next</PaginationLink>}
      </PaginationBar>
    </FeedWrapper>
  );

}

export default Feed;
