// Seleção de elementos
const tarefaForm = document.querySelector("#form-task");
const tarefaInput = document.querySelector("#input-task");
const listaDia = document.querySelector("#list-tasks-day");
const listaNoite = document.querySelector("#list-tasks-night");
const editarForm = document.querySelector("#edit-form");
const editarInput = document.querySelector("#input-edit");
const btnCancelarEdicao = document.querySelector("#edit-btn-cancel");

let valorAntigoInput; 

//FUNÇÕES
// adicionar tarefa
const adicionarTarefaDia = (text) => {
  salvarTarefa(text, 0, 1, "Dia");
};

const adicionarTarefaNoite = (text) => {
  salvarTarefa(text, 0, 1, "Noite");
};

// salvar uma nova tarefa
const salvarTarefa = (text, done = 0, save = 1, periodo) => {
  const tarefa = document.createElement("div");
  tarefa.classList.add("task");

  const tarefaTitulo = document.createElement("h4");
  tarefaTitulo.innerText = text;
  tarefa.appendChild(tarefaTitulo);

  const btnFeito = document.createElement("button");
  btnFeito.classList.add("concluir-task");
  btnFeito.innerHTML = '<i class="fa-solid fa-check"></i>';
  tarefa.appendChild(btnFeito);

  const btnEditar = document.createElement("button");
  btnEditar.classList.add("editar-task");
  btnEditar.innerHTML = '<i class="fa-solid fa-pen"></i>';
  tarefa.appendChild(btnEditar);

  const btnDeletar = document.createElement("button");
  btnDeletar.classList.add("remover-task");
  btnDeletar.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  tarefa.appendChild(btnDeletar);

  // utilizando dados da localStorage
  if (done) {
    tarefa.classList.add("done"); // adiciona a classe done se a tarefa estiver concluída
  }

  if (save) {
    salvarTarefaLocalStorage({ text, done: 0, periodo });
  }

  if (periodo === "Dia") {
    listaDia.appendChild(tarefa);
  } else {
    listaNoite.appendChild(tarefa);
  }

  tarefaInput.value = ""; 

  // tarefaInput.focus();
};

// alterna formulário de inclusão e edição de tarefa
const toggleForms = () => {
  editarForm.classList.toggle("hide");
  tarefaForm.classList.toggle("hide");
  listaDia.classList.toggle("hide");
  listaNoite.classList.toggle("hide");
};

// atualizar uma tarefa
const atualizarTarefa = (text) => {
  const tarefas = document.querySelectorAll(".task");

  tarefas.forEach((tarefa) => {
    let tarefaTitulo = tarefa.querySelector("h4");

    if (tarefaTitulo.innerText === valorAntigoInput) {
      tarefaTitulo.innerText = text;

      // utilizando dados da localStorage
      atualizarTarefaLocalStorage(valorAntigoInput, text); 
    }
  });
};


//EVENTOS
// identifica o período da tarefa
document.getElementById("task-day").addEventListener("click", (e) => {
  e.preventDefault();
  
  const valorInput = tarefaInput.value; 
  if(valorInput) {
    adicionarTarefaDia(valorInput);
  }
});

document.getElementById("task-night").addEventListener("click", (e) => {
  e.preventDefault();
  
  const valorInput = tarefaInput.value; 
  if(valorInput) {
    adicionarTarefaNoite(valorInput);
  }
});

tarefaForm.addEventListener("keydown", function (e) {
  if(e.key === "Enter") {
    e.preventDefault();
  }
});

// botão de ação (concluir, editar, remover)
document.addEventListener("click", (e) => {
  const elementoTarget = e.target; 
  const elementoPai = elementoTarget.closest("div"); 
  let tarefaTitulo;

  if (elementoPai && elementoPai.querySelector("h4")) {
    tarefaTitulo = elementoPai.querySelector("h4").innerText || "";
  }

  if (elementoTarget.classList.contains("concluir-task")) {
    elementoPai.classList.toggle("done");

    atualizarTarefaStatusLocalStorage(tarefaTitulo);
  }

  if (elementoTarget.classList.contains("editar-task")) {
    toggleForms();

    editarInput.value = tarefaTitulo;
    valorAntigoInput = tarefaTitulo;
  }

  if (elementoTarget.classList.contains("remover-task")) {
    elementoPai.remove();

    // utilizando dados da localStorage
    removerTarefaLocalStorage(tarefaTitulo);
  }
});

// editar tarefa
editarForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editarValorInput = editarInput.value;

  if (editarValorInput) {
    atualizarTarefa(editarValorInput);
  }

  toggleForms();
});

editarForm.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
  }
});

//Cancelar edição
btnCancelarEdicao.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});


// localStorage
const obterTarefasLocalStorage = () => {
  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

  return tarefas;
};

const carregarTarefas = () => {
  const tarefas = obterTarefasLocalStorage();

  tarefas.forEach((tarefa) => {
    if (tarefa.periodo === "Dia") {
      salvarTarefa(tarefa.text, tarefa.done, 0, "Dia");
    } else {
      salvarTarefa(tarefa.text, tarefa.done, 0, "Noite");
    }
  });
};

const salvarTarefaLocalStorage = (tarefa) => {
  const tarefas = obterTarefasLocalStorage();

  tarefas.push(tarefa);

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
};

const removerTarefaLocalStorage = (tarefaText) => {
  const tarefas = obterTarefasLocalStorage();

  const filtrarTarefas = tarefas.filter((tarefa) => tarefa.text != tarefaText);

  localStorage.setItem("tarefas", JSON.stringify(filtrarTarefas));
};

const atualizarTarefaStatusLocalStorage = (tarefaText) => {
  const tarefas = obterTarefasLocalStorage();

  tarefas.map((tarefa) =>
    tarefa.text === tarefaText ? (tarefa.done = !tarefa.done) : null
  );

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
};

const atualizarTarefaLocalStorage = (tarefaAntigaText, tarefaNovaText) => {
  const tarefas = obterTarefasLocalStorage();

  tarefas.map((tarefa) =>
    tarefa.text === tarefaAntigaText ? (tarefa.text = tarefaNovaText) : null
  );

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
};

carregarTarefas();