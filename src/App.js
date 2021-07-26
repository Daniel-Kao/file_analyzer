import React from "react";
import "./App.css";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import reqwest from "reqwest";

class App extends React.Component {
  state = {
    fileList: [],
    uploading: false,
    maxImages: 2,
  };

  handleUpload = () => {
    const { fileList } = this.state;
    console.log(fileList);
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files[]", file);
    });

    this.setState({
      uploading: true,
    });

    reqwest({
      url: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      method: "post",
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          fileList: [],
          uploading: false,
        });
        message.success("upload successfully.");
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error("upload failed.");
      },
    });
  };

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      accept: ".png,.jpeg,.jpg",
      multiple: true,
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: async (file) => {
        if (file.size > 10 * 1024 * 1024) {
          message.warn("image size too large");
        }
        await this.setState((state) => ({
          fileList: [...state.fileList, file],
        }));

        if (this.state.fileList.length > this.state.maxImages) {
          await this.setState((state) => ({
            fileList: state.fileList.slice(0, this.state.maxImages),
          }));
          console.log(this.state.fileList);
        }

        console.log(this.state.fileList.length);
        return false;
      },
      fileList,
    };

    return (
      <div className="App">
        <header className="App-header">
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Select File (10 maximum)</Button>
          </Upload>
          <Button
            type="primary"
            onClick={this.handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? "Uploading" : "Start Upload"}
          </Button>
          <p style={{ marginTop: "30px", fontSize: "1rem" }}>
            max file size: 10MB, max files each upload: 10
          </p>
        </header>
      </div>
    );
  }
}

export default App;
