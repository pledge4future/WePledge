export const getCookie = (cname: string): string => {
  const cookie = document.cookie;
  var name = cname + "=";
  var ca = cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const setCookie = (name: string, value: string): void => {
  const date = new Date()
  
  date.setTime(date.getTime() + (7*24*60*60*1000));

  document.cookie = name+ " = " + value + "; expires= " + date.toUTCString() + "; path=/"; 
}
