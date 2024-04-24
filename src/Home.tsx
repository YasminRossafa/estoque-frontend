import './Home.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importe o Axios para fazer requisições HTTP

interface Product {
  nome: string; // Renomeie os campos para corresponder ao backend
  descrição: string;
  valor: number;
  quantidade: number;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [editingProductName, setEditingProductName] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>('http://localhost:5050/produtos');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao obter produtos:', error);
    }
  };

  const addProduct = async () => {
    const newProduct: Omit<Product, 'id'> = { nome: name, descrição: description, valor: price, quantidade: quantity };
    try {
      await axios.post('http://localhost:5050/produtos', newProduct);
      fetchProducts();
      clearForm();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const editProduct = async () => {
    if (!editingProductName) return;
    const updatedProduct: Product = {
      nome: name,
      descrição: description,
      valor: price,
      quantidade: quantity,
    };
    try {
      await axios.put(`http://localhost:5050/produtos/${editingProductName}`, updatedProduct);
      fetchProducts();
      clearForm();
    } catch (error) {
      console.error('Erro ao editar produto:', error);
    }
  };

  const deleteProduct = async (name: string) => {
    try {
      await axios.delete(`http://localhost:5050/produtos/${name}`); // Corrigido
      fetchProducts();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setPrice(0);
    setQuantity(0);
    setEditingProductName(null);
  };

  const startEditing = (product: Product) => {
    setName(product.nome);
    setDescription(product.descrição);
    setPrice(product.valor);
    setQuantity(product.quantidade);
    setEditingProductName(product.nome);
  };

  return (
    <div className='container2'>
      <h1>Produtos</h1>
      <div>
        <label htmlFor="name">Nome do Produto:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Digite o nome do produto"
        />
        <br />
        <label htmlFor="description">Descrição do Produto:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Digite a descrição do produto"
        />
        <br />
        <label htmlFor="price">Preço do Produto:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
          placeholder="Digite o preço do produto"
        />
        <br />
        <label htmlFor="quantity">Quantidade do Produto:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          placeholder="Digite a quantidade do produto"
        />
        <br />
        {editingProductName ? (
          <button onClick={editProduct}>Editar Produto</button>
        ) : (
          <button onClick={addProduct}>Adicionar Produto</button>
        )}
        <button onClick={clearForm}>Cancelar</button>
      </div>
      <div>
        <h2>Produtos Cadastrados</h2>
        <ul>
          {products.map(product => (
            <li key={product.nome}>
              {product.nome} - {product.descrição} - {product.valor ? `R$ ${product.valor.toFixed(2)}` : 'Preço não disponível'} - {product.quantidade} unidade(s)
              <button onClick={() => startEditing(product)}>Editar</button>
              <button onClick={() => deleteProduct(product.nome)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
