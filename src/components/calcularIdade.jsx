function calcularIdade(dataNascimento) {
  if (!dataNascimento) return 'Não informada';
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  const dia = hoje.getDate() - nascimento.getDate();

  if (mes < 0 || (mes === 0 && dia < 0)) {
    idade--;
  }
  return idade;
}

export default calcularIdade