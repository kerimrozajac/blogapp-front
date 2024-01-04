import React, { useState, useContext } from "react";
import { Button, Form, Image } from "react-bootstrap";
import axiosService from "../../helpers/axios";
import { useUserActions } from "../../hooks/user.actions";

import { Context } from "../Layout";

function CreateComment(props) {
  const { postId, refresh } = props;
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({
    body: "",
  });

  const { setToaster } = useContext(Context);

  const user = getUser();
  console.log('User Object:', user);

  const handleSubmit = (event) => {
    event.preventDefault();
    const createCommentForm = event.currentTarget;

    if (createCommentForm.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    const data = {
      author: user.id,
      body: form.body,
      post: postId,
    };

    axiosService
      .post(`/post/${postId}/comment/`, data)
      .then(() => {
        setForm({ body: "" });
        setToaster({
          type: "success",
          message: "Comment posted successfully 🚀",
          show: true,
          title: "Comment!",
        });
        refresh();
      })
      .catch(() => {
        setToaster({
          type: "danger",
          message: "An error occurred.",
          show: true,
          title: "Error",
        });
      });
  };

  return (
    <Form
      className="d-flex flex-row justify-content-between"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
      data-testid="create-comment-test"
    >
      {user && (
        <Image
          src={user.avatar}
          roundedCircle
          width={48}
          height={48}
          className="my-2"
        />
      )}
      <Form.Group className="m-3 w-75">
        <Form.Control
          className="py-2 rounded-pill border-primary"
          type="text"
          data-testid="comment-body-field"
          placeholder="Write a comment"
          value={form.body}
          name="body"
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please enter a comment.
        </Form.Control.Feedback>
      </Form.Group>
      <div className="m-auto">
        <Button
          variant="primary"
          data-testid="create-comment-submit"
          type="submit"
          size="small"
        >
          Comment
        </Button>
      </div>
    </Form>
  );
}

export default CreateComment;
