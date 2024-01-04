import React from "react";
import Layout from "../components/Layout";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { fetcher } from "../helpers/axios";
import Post from "../components/posts/Post";
import axiosService from "../helpers/axios";
import { getUser } from "../hooks/user.actions";

function SinglePost() {
  const { postId } = useParams();


  // Token from local storage to header
  const retrievedToken = localStorage.getItem('authToken');
  axiosService.defaults.headers.common['Authorization'] = `Token ${retrievedToken}`;

  //pozivanje posta
  const post = useSWR(`/${postId}/`, fetcher);

  const user = getUser();
  console.log('User Object:', user);

  return (
    <Layout hasNavigationBack>
      <Row className="justify-content-center">
        <Col sm={8}>
          {post.data ? (
            <Post post={post.data} refresh={post.mutate} isSinglePost />
          ) : (
            <div>Loading...</div>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

export default SinglePost;
