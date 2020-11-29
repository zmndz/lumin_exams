
export default async function({ store, redirect, route}) {
  // console.log("STORE:", store);
  // console.log("ROUTE:", route);

  let path = route.path;
  let userType = localStorage.getItem("userType");
  // let isAdminLoggedIn = store.getters.getIsAdminLoggedIn;
  let isAdminLoggedIn = localStorage.getItem("adminVerifyToken");
  let isStudentLoggedIn = store.getters.getIsStudentLoggedIn;

  if (path == "/" && (userType == 'admin') && isAdminLoggedIn) {
    console.log("you are logged in as ADMIN");
    return redirect("/admin");
  } else if ((path.startsWith('/admin') && !isAdminLoggedIn)) {
    return redirect("/operator");
  } else if ((path == '/operator' && isAdminLoggedIn)) {
    return redirect("/admin");
  } else if ((path.startsWith('/student') && (userType == 'admin') && !isStudentLoggedIn)) {
    return redirect("/admin");
  } else if ((path.startsWith('/student') && (userType == null))) {
    return redirect("/");
  } else if ((path.startsWith('/student') && (userType == 'admin') && isAdminLoggedIn)) {
    return redirect("/");
  }

  if (path == "/" && (userType == 'student') && isStudentLoggedIn) {
    console.log("you are logged in as ADMIN");
    return redirect("/student");
  } else if ((path.startsWith('/student') && !isStudentLoggedIn)) {
    return redirect("/");
  } else if ((path == '/' && isStudentLoggedIn)) {
    return redirect("/student");
  } else if ((path.startsWith('/admin') && (userType == 'student') && !isAdminLoggedIn)) {
    return redirect("/student");
  } else if ((path.startsWith('/admin') && (userType == null))) {
    return redirect("/operator");
  }

  // if (!route.matched.length) {
  //   console.log(404);
  // } else if ((path == '/' && (userType == 'admin') && isAdminLoggedIn) || (path == '/admin' && (userType == 'admin' && isAdminLoggedIn))) {
  //   console.log("you are logged in as ADMIN");
  //   return redirect("/admin/exams");
  // } else if ((path == '/' && (userType == 'student') && isStudentLoggedIn) || (path == '/student' && (userType == 'student') && isStudentLoggedIn)) {
  //   console.log("you are logged in as STUDENT");
  // } else if ((path == '/' && (userType == 'admin') && !isAdminLoggedIn) || (path == '/admin' && (userType == 'admin') && !isAdminLoggedIn)) {
  //   console.log("login failed as ADMIN", path, userType, isAdminLoggedIn);
  //   console.log("login failed as ADMIN");
  // } else if ((path == '/' && (userType == 'student') && !isStudentLoggedIn) || (path == '/student' && (userType == 'student') && !isStudentLoggedIn)) {
  //   console.log("login failed as STUDENT");
  // } else if (path.startsWith('/admin') && !isAdminLoggedIn){
  //   console.log("return to login");
  //   return redirect("/admin");
  // } else if (path.startsWith('/student') && !isStudentLoggedIn){
  //   console.log("return student login 1");
  //   return redirect("/");
  // } else if (path == '/' && (userType == null)){
  //   console.log("NO STUDENT LOGIN?");
  //   // return redirect("/");
  // } else if (path == '/admin' && (userType == null)){
  //   console.log("NO ADMIN LOGIN?");
  //   // return redirect("/admin");
  // }

    // if (userType === 'admin' && isAdminLoggedIn) {
    //   console.log("you are logged in as STUDENT");
    //   // return redirect("/admin/exams");
    // } else if (userType === 'student' && isStudentLoggedIn){
    //   console.log("student:", userType);
    // }
}
