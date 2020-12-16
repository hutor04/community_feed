import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import Card from '../components/Card/Card';

const QuestionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin: 5%;
`;

const Alert = styled.div`
  text-align: center;
`;

const ROOT_API = 'https://api.stackexchange.com/2.2/';

const Question = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch(`${ROOT_API}questions/${id}?site=stackoverflow`);
        const dataJSON = await data.json();
        setData(dataJSON);
        setLoading(false);
        setError(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || error) {
    return (
      <>
        <Helmet>
        <title>{`Q&A Feed - Question #${id}`}</title>
        </Helmet>
        <Alert>{loading ? 'Loading...' : error}</Alert>
      </>
    );
  }
  return (
    <>
      <Helmet>
        <title>{`Q&A Feed - Question #${id}`}</title>
      </Helmet>
      <QuestionWrapper>
        <Card key={data.items[0].qustion_id} data={data.items[0]} />
      </QuestionWrapper>
    </>
  );

};

export default Question;
