const firebaseConfig = {
  apiKey: "ISI",
  authDomain: "ISI",
  databaseURL: "ISI",
  projectId: "ISI",
  appId: "ISI"
};

firebase.initializeApp(firebaseConfig);
const auth=firebase.auth();
const db=firebase.database();

const loginBtn=document.getElementById("loginBtn");
const userBox=document.getElementById("user");
const saldoText=document.getElementById("saldo");
const emailText=document.getElementById("email");

loginBtn.onclick=()=>{
  auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
};

auth.onAuthStateChanged(u=>{
  if(u){
    loginBtn.style.display="none";
    userBox.classList.remove("hidden");
    emailText.innerText=u.email;

    db.ref("users/"+u.uid).on("value",s=>{
      saldoText.innerText=s.val()?.saldo||0;
    });
  }
});

function addSaldo(){
  const u=auth.currentUser;
  db.ref("users/"+u.uid+"/saldo")
    .transaction(v=>(v||0)+1000);
}

function withdraw(){
  const u=auth.currentUser;
  const amt=prompt("Jumlah WD:");
  if(!amt)return;
  db.ref("withdraws").push({
    uid:u.uid,email:u.email,
    amount:+amt,status:"pending",
    time:Date.now()
  });
  alert("WD dikirim");
}

function logout(){auth.signOut()}
