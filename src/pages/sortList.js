import {Button, Icon} from 'antd';
import React, {Component} from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import styled from "styled-components";

const arrayMoveMutate = (array, from, to) => {
	array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
};

const arrayMove = (array, from, to) => {
	array = array.slice();
	arrayMoveMutate(array, from, to);
	return array;
};
 
const SortableItem = SortableElement(({value, idx, upHandle, dataSource, downHandle}) => {
  return (
    <ButtonItemWrapperLi>
      <InfoWrapper>
        <Icon style={{marginRight: "8px"}} type="file" />
        {value}
      </InfoWrapper>
      <ButtonWrapper>
        {idx !== 0 && <Button style={{height: "24px", padding: "0", marginLeft: "16px"}} disabled={idx === 0} onClick={upHandle}><Icon type="vertical-align-top" /></Button>}
        {idx !== dataSource.length - 1 &&
        <Button style={{height: "24px", padding: "0", marginLeft: "16px"}} disabled={idx === dataSource.length - 1} onClick={downHandle}>
          <Icon type="vertical-align-bottom" /></Button>}
      </ButtonWrapper>
    </ButtonItemWrapperLi>
  )
});
 
const SortableList = SortableContainer(({items, self}) => {
  return (
    <ButtonWrapperUl style={{cursor: "default"}}>
      {items.map((item, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          value={item.text}
          dataSource={items}
          idx={index}
          upHandle={() => self.upHandle(item, index)}
          downHandle={() => self.downHandle(item, index)}
          />
      ))}
    </ButtonWrapperUl>
  );
});
 
export class SortList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.items) !== JSON.stringify(this.props.items)) {
      this.setState({items: nextProps.items});
    }
  }
  arrayMoveHandle(type, index) {
    const { items } = this.state;
    const newOptions = arrayMove(items, index, type === "up" ? 0 : (items.length - 1));
    this.setState({ items: newOptions });
  }

  upHandle = (item, index) => {
    this.arrayMoveHandle("up", index);
  }

  downHandle = (item, index) => {
    this.arrayMoveHandle("down", index);
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({items}) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }));
  };
  handler = () => {
    return this.state.items;
  }
  render() {
    return (
      <SortableList
        self={this}
        items={this.state.items}
        onSortEnd={this.onSortEnd}
        />
    )
  }
}

const ButtonItemWrapperLi = styled.li`
  &{
    background: #FFFFFF;
    height: 24px;
    margin-left: 16px;
    line-height: 24px;
    visibility: visible !important;
    list-style: none;
    z-index: 9999;
    cursor: default;
    &:not(:last-child) {
      margin-bottom: 4px;
    }
  }
`;
const ButtonWrapperUl = styled.ul`
  &{

    list-style: none;
    padding-left: 0;
  }
`;
const InfoWrapper = styled.div`
  &{
    display: inline-block;
    width: 80%;
    height: 24px;
    line-height: 22px;
    border-radius: 4px;
    padding-left: 10px;
    border: 1px solid transparent;
    :hover {
      border-color: #D8D8D8;
    }
  }
`;
const ButtonWrapper = styled.div`
  &{
    display: inline-block;
    vertical-align: top;
    button{
      border: none !important;
    }
  }
`;


 