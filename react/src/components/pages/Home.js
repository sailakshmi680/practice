import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Input, Button, Spin, Modal } from "antd";
import axios from "axios";
const { TextArea } = Input;


const Home = () => {
  const [loading, setLoading] = useState(false);
  const [noteData, setNoteData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  useEffect(() => {
    setLoading(false)
    getNotes();
  }, []);

  const getNotes = () => {
    axios
      .get("/getNotes")
      .then((response) => {
        setNoteData(response.data);

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const addNote = (values) => {
    if (values.title === undefined && values.comment === undefined) {
      alert("Please fill in the fields");
    } else {
      const data = {
        title: values.title,
        content: values.comment,
      };
  
      axios.post("/createNotes", data)
        .then((res) => {
          if (res.data.success === true) {
            getNotes();
            form.resetFields();
          } else {
            console.log(res.data.message);
          }
        })
        .catch((error) => {
          console.error("Error adding note:", error);
        });
    }
  };
  
  const deleteNote = (id) => {
    axios
      .delete(`/deleteNote/${id}`)
      .then((res) => {
        if (res.data.success === true) {
          getNotes();
          alert("Note deleted successfully");
        }
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
        alert("An error occurred while deleting the note.");
      });
  };

  const editNote = (id) => {
    axios
      .get(`/getDetails/${id}`)
      .then((response) => {
        setEditData(response.data);
        setShowModal(true); 
        form1.resetFields();
      })
      .catch((error) => {
        console.error("Error fetching note for editing:", error);
      });
  };

  const updateNote = (values) => {
  const data = {
    title: values.title,
    content: values.comment
  };

  console.log("data", data);

  axios.put(`/updateNote/${editData?._id}`, data)
    .then((res) => {
      if (res.data.success) {
        setShowModal(false);
        form1.resetFields();
        getNotes();
        setEditData([])
      } else {
        console.log("Update failed:", res.data.message);
      }
    })
    .catch((error) => {
      console.error("Error updating note:", error);
    });
};

  return (
    <>
      <h1>Notes</h1>
      {loading && <Spin size="large"/>}
      <Row justify="center">
      <Card className="glassmorphic-container">
        <div className="glassmorphic-box">
          <Form form={form} onFinish={addNote}>
            <Row justify={"center"}>
              <Col span={10}>
                <label>
                  <b style={{ fontSize: "20px" }}>Title</b>
                </label>
                <Form.Item name="title">
                  <Input placeholder="Enter Notes" />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={12}>
                <Form.Item name="comment">
                  <TextArea rows={5} placeholder="Enter comment" style={{marginLeft:'-9px'}}/>
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={3}>
                <Form.Item>
                  <Button  htmlType="submit" style={{marginLeft:'-100px'}}>
                    Add Note
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
    </Row>
      <Row justify={"center"} style={{ padding: "5px" }}>
        {/* <Col span={12}> */}
        <Card
          style={{
            backgroundColor: "#fef6ae",
            width: "40%",
            padding: "10px",
            margin: "5px",
          }}
          // className="glassmorphic-container"
        >
          <Row>
            {noteData?.map((e) => {
              return (
                <Col span={7} offset={1}>
                  <Card className="small-box">
                    <div className="card-content">
                    <h1>{e.title}</h1>
                    </div>
                    <div className="comment-content">
                    <p>{e.content}</p>
                    </div>
                    <Row>
                      <Col span={2} offset={0}>
                        <Button
                         className="btnStyle"
                          style={{ color: "red" }}
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are your sure you want to delete this note ?"
                              )
                            ) {
                              deleteNote(e._id);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </Col>
                      <Col span={2} offset={13}>
                        <Button
                          className="btnStyle"
                          htmlType="submit"
                          onClick={() => editNote(e._id, noteData)}
                          style={{color:'#6a2575'}}
                        >
                          Edit
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
        {/* </Col> */}
      </Row>
      {/* Edit Modal */}
      <Modal
        title={"Edit Note"}
        visible={showModal}
        destroyOnClose={true}
        onCancel={() => setShowModal(false)}
        //  width={"800px"}
        footer={null}  
      >
        <div>
          <>
            <Card className="modal-box">
              <Form form={form1} onFinish={updateNote}>
                <Row justify={"center"}>
                  <Col span={12}>
                    <label>
                      <b style={{ fontSize: "20px" }}>Title</b>
                    </label>
                    <Form.Item name="title" initialValue={editData?.title} >
                      <Input placeholder="Enter Notes" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify={"center"}>
                  <Col span={12}>
                    <Form.Item name="comment" initialValue={editData?.content}>
                      <TextArea rows={5} placeholder="Enter comment" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                      <Col span={2} offset={8}>
                        <Button
                         className="btnStyle"
                          style={{ color: "red" }}                          
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col span={2} offset={3}>
                        <Button
                          className="btnStyle"
                          htmlType="submit"
                          style={{color:'#6a2575'}}
                        >
                          Update
                        </Button>
                      </Col>
                    </Row>
              </Form>
            </Card>
          </>
        </div>
      </Modal>

    </>
  );
};

export default Home;
