// define a constante de conversão de microsegundos para segundos
const MICROSECONDS_PER_SECOND = 1000000;

// define as constantes de conversão de segundos para dias, horas, minutos e segundos
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

// função para converter microsegundos em dias, horas, minutos e segundos
function convertMicroseconds(microseconds: number) {
  // primeiro, converte os microsegundos em segundos
  let seconds = microseconds / MICROSECONDS_PER_SECOND;

  // depois, converte os segundos em dias, horas, minutos e segundos
  let days = Math.floor(
    seconds / SECONDS_PER_MINUTE / MINUTES_PER_HOUR / HOURS_PER_DAY
  );
  seconds -= days * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;
  let hours = Math.floor(seconds / SECONDS_PER_MINUTE / MINUTES_PER_HOUR);
  seconds -= hours * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
  let minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  seconds -= minutes * SECONDS_PER_MINUTE;

  // retorna os resultados em um objeto
  return { days, hours, minutes, seconds: Math.round(seconds) };
}

type ConvertDateProps = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getFutureDate(convertDate: ConvertDateProps) {
  // Cria um objeto Date para a data atual
  let currentDate = new Date();

  // Adiciona o número de dias passado como parâmetro à data atual
  currentDate.setDate(currentDate.getDate() + convertDate.days);
  currentDate.setHours(currentDate.getHours() + convertDate.hours);
  currentDate.setMinutes(currentDate.getMinutes() + convertDate.minutes);
  currentDate.setSeconds(currentDate.getSeconds() + convertDate.seconds);

  let endDate = currentDate;

  return { endDate };
}

export const countDown = (microseconds: number) => {
  const convertDays = convertMicroseconds(microseconds);
  const { endDate } = getFutureDate(convertDays);

  return { endDate };
};
