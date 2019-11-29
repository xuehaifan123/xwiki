import { Button, Modal } from 'antd';
import axios from 'axios';
import React, { Component } from 'react';
import styled from "styled-components";
import {SortList} from './sortList';
import globalMitt from '../globalMitt';

const fake = '[{"id":"wiki:xwiki","text":"Home","icon":"fa fa-hdd-o","children":true,"data":{"id":"xwiki","type":"wiki","validChildren":["space","document","pagination"],"canDelete":false},"a_attr":{"href":"/xwiki/bin/view/Main/"}},{"id":"document:xwiki:page01.WebHome","text":"page01","icon":"fa fa-file-o","children":true,"data":{"id":"xwiki:page01.WebHome","type":"document","validChildren":["translations","attachments","attachment","classProperties","objects","document","pagination"],"hasContextMenu":true,"draggable":true,"canDelete":true,"canMove":true,"canCopy":true,"createDocumentURL":"/xwiki/bin/create/page01/WebHome"},"a_attr":{"href":"/xwiki/bin/view/page01/"}}]';
let fakeData = JSON.parse(fake);
class SortModal extends Component {
  componentDidMount() {
    globalMitt.on("test", this.eventHandler);
  }

  componentWillUnmount() {
    globalMitt.off("test", this.eventHandler);
  }

  eventHandler = (pageId) => {
    this.setState({visible: true});
    axios.get("/xwiki/bin/get/WebHome", {
      params: {
        outputSyntax: "plain",
        sheet: "XWiki.DocumentTree",
        showAttachments: false,
        showTerminalDocuments: false,
        showTranslations: false,
        showRoot: true,
        data: "path",
        id: `document:${pageId}`,
      }
    }).then((res) => {
      const data = res.data || [];

      if (Array.isArray(data) && data.length > 0) {
        const parentId = data[data.length - 2].id;
        axios.get("/xwiki/bin/get/WebHome", {
          params: {
            outputSyntax: "plain",
            sheet: "XWiki.DocumentTree",
            showAttachments: false,
            showTerminalDocuments: false,
            showTranslations: false,
            showRoot: false,
            data: "children",
            id: parentId,
          }
        }).then((res) => {
          this.setState({list: res.data});
        });
      }
    });
    // this.setState({list: fakeData});
  }
  
  state = {
    visible: true,
    list: [],
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
    const finalList = this.sortList.handler();
    this.setState({list: []});
    console.log(finalList, "finalList")
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      list: [],
    });
  };

  render() {
    const {list} = this.state;
    return (
      <Modal
        title="调整顺序"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <IButton key="back" type={"button"} className={"btn btn-default"} onClick={this.handleCancel}>
            {"取消"}
          </IButton>,
          <IButton key="submit" type={"button"} className={"btn btn-primary"} onClick={this.handleOk}>
            {"确定"}
          </IButton>,
        ]}
      >
        <SortList ref={(ref) => {
          if (ref) {
            this.sortList = ref;
          }
        }} items={list} />
      </Modal>
    );
  }
}

const IButton = styled.button`
  &{
    padding: 6px 20px;
  }
`;

export default SortModal;
