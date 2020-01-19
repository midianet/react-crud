//Productproduct
import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import {Form, FormGroup, Label, Input, Button, Table, Alert}  from "reactstrap";

const Message = () => {
    return {
        phrase: 'Teste',
        level: 'info',
    }
};

const Product = () => {
    return {
        id: null,
        description: '',
        price: '',
        quantity: '',
    }
};

class FormProduct extends Component {

    state = {
        product : Product(),
    };

    componentDidMount() {
        PubSub.subscribe('edit-product', (topic, product) => {
            this.setState({ product });
        });
    }

    setValue = (e) => {
        let {product} = this.state;
        product[e.target.id] = e.target.value;
        this.setState({product});
    };

    onSave = () => {
        let {product} = this.state;
        this.props.onSave(product);
        this.setState({product: Product()});
    };

    render() {
        let {product} = this.state;
        return(
          <Form>
              <FormGroup>
                  <Label for="description">Descrição</Label>
                  <Input id="description" value={product.description} type="text" placeholder="Descrição do Produto..." onChange={this.setValue} />
              </FormGroup>
              <FormGroup>
                  <div className="form-row">
                      <div className="col-md-6">
                          <Label for="price">Preço</Label>
                          <Input id="price" value={product.price} type="text" placeholder="R$ " onChange={this.setValue} />
                      </div>
                  </div>
                  <div className="form-row">
                      <div className="col-md-6">
                          <Label for="quantity">Quantidade</Label>
                          <Input id="quantity" value={product.quantity} type="text" placeholder="Qtd. de produtos disponíveis" onChange={this.setValue} />
                      </div>
                  </div>
              </FormGroup>
              <Button color="primary" type="button" block onClick={this.onSave} > Gravar </Button>
          </Form>
        );
    }

}

class ListProduct extends Component {

    onDelete = (id) => {
       this.props.onDelete(id);
    };

    onEdit = (product) => {
        PubSub.publish('edit-product', product);
    };

    render() {
        const { products } = this.props;
        return (
            <div>
                <br />
                <Table>
                    <thead className="thread-dark">
                        <tr>
                            <th>Descrição</th>
                            <th>Preço</th>
                            <th>Qtde.</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        products.map(product => (
                           <tr key={product.id}>
                               <td>{product.description}</td>
                               <td>{product.price}</td>
                               <td>{product.quantity}</td>
                               <td>
                                   <Button color="info"   onClick={e => this.onEdit(product)} size="sm">Editar</Button>
                                   <Button color="danger" size="sm" onClick={e => this.onDelete(product.id)} >Deletar</Button>
                               </td>
                           </tr>
                        ))
                    }
                    </tbody>
                </Table>
            </div>
        )
    }

}

export default class ProductBox extends Component {

    state = {
        products: [],
        message: null,
    };

    onSave = (product) => {
        let {products} = this.state;
        if(product.id == null){
            product.id = products.length + 1;
            products.push(product);
            let message = Message();
            message.phrase = 'Novo Produto adicionado!';
            message.level = 'success';
            this.setState({message,products});
            this.timerMessage(3000);
        }else{
           let index =  products.findIndex(p => p.id === product.id);
            products[index] = product;
            let message = Message();
            message.phrase = 'Produto atualizado!';
            message.level = 'info';
            this.setState({message,products});
            this.timerMessage(3000);
        }

    };

    onDelete = (id) => {
        let {products} = this.state;
        products = products.filter(p => p.id !== id);
        let message = Message();
        message.phrase = 'Produto deletado!';
        message.level = 'danger';
        this.setState({message,products});
        this.timerMessage(3000);
    };


    timerMessage = (duration) => {
        setTimeout(() => {
            this.setState({message: null});
        }, duration);
    };

    render() {

        const {message} = this.state;

        return (
            <div>
                {this.state.message !== null ? (<Alert color={message.level} className="text-center">{message.phrase}</Alert>): ''}
                <div className="row">
                    <div className="col-md-6 my-3">
                        <h2 className="font-weight-bold text-center">Cadastro de Produtos</h2>
                        <FormProduct onSave={this.onSave} />
                    </div>
                    <div className="col-md-6 my-3">
                        <h2 className="font-weight-bold text-center">Lista de Produtos</h2>
                        <ListProduct products={this.state.products}  onDelete={this.onDelete} />
                    </div>
                </div>
            </div>
        )
    }

}


