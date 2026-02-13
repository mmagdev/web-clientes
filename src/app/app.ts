import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

    //Criando um objeto da classe HttpClient
    private http = inject(HttpClient);

    //Atributo para armazenar os dados da consulta de clientes
    clientes = signal<any[]>([]);

    //Abritudo para guardar os dados do cliente editado
    cliente = signal<any | null>(null); //Valor inicial é null (vazio)

    //Atributo para guardar o endereço da API
    private apiUrl = 'http://localhost:8081/api/v1/clientes';

    //Criando a estrutura do formulário de cadastro de clientes
    formCadastroEdicao = new FormGroup({ //formulário
      nome : new FormControl(''), //campo 'nome'
      email : new FormControl(''), //campo 'email'
      telefone : new FormControl('') //campo 'telefone'
    });

    //Criando a estrutura do formulário de consulta
    formConsulta = new FormGroup({
      nome : new FormControl('') //campo 'nome' para consulta
    });

    //Função para realizar o cadastro do cliente
    salvar() {

      //Verificar se nenhum cliente foi selecionado para edição
      if (this.cliente() == null) {//Realizar o cadastro de um novo cliente

        //Fazendo uma requisição HTTP POST para a API
      this.http.post(this.apiUrl, this.formCadastroEdicao.value, { responseType: 'text' })
        .subscribe((mensagem) => { //Aguardando o retorno da requisição
            alert(mensagem); //Exibir a mensagem para o usuário
            this.formCadastroEdicao.reset(); //Limpar o formulário
        }); 

      }
      else {
        //Fazendo a requisição HTTP PUT para a API, passando o ID do cliente a ser editado
        this.http.put(this.apiUrl + '/' + this.cliente()!.id, this.formCadastroEdicao.value, { responseType: 'text' })
        .subscribe((mensagem) => {
          alert(mensagem); //Exibir a mensagem para o usuário
          this.formCadastroEdicao.reset(); //Limpar o forumário
          this.consultar(); //Fazendo uma nova consulta
          this.cliente.set(null); //Fazendo nova consulta
          this.cliente.set(null); //Voltar para a opção de cadastro

        });

      }

      
    }


    //Função para realizar a consulta de clientes
    consultar() {

      //Fazendo uma requisiçao HTTP GET para a API, passando o nome como parâmetro
      this.http.get(this.apiUrl + '/' + this.formConsulta.value.nome)
        .subscribe((clientes) => {
          this.clientes.set(clientes as any[]); //Atualizar o sinal com os dados dos clientes
        }); //Aguardando o retorno da requisição e exibindo os clientes encontrados

    }

    //Funçao para realizar a exclusão de um cliente
    excluir(id : number) {

      //Verificar se o usuário deseja realmente excluir um cliente
      var confirmacao = window.confirm('Tem certeza que deseja excluir este cliente?');
      if (! confirmacao) {
        return; //Cancelar a exclusão

      }

      //Fazendo uma requiesição HTTP DELETE para a API
      this.http.delete(this.apiUrl + '/' + id, { responseType: 'text'}).subscribe((mensagem) => {
        alert(mensagem); //Exibir a mensagem obtida
        this.consultar(); //Executando uma nova consulta

    });
  }

  editar(cliente: any) {

    //Armazenar os dados do cliente selecionado no sinal 'cliente'
    this.cliente.set(cliente);


    //Preencher os campos do formulário de edição com os dados do cliente selecionado
    this.formCadastroEdicao.patchValue(cliente);
  }
  
}