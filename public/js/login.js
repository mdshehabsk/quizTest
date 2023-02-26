

const login_form = document.getElementById('login_form')

login_form.onsubmit = async event => {
    event.preventDefault()
    try {
        const username = event.target.username.value;
        const password = event.target.password.value
        if(!username || !password){
           return alert('please fill all the field')
        }
        const res = await axios.post('/login',{
            username,
            password
        })
        Toastify({
            text: res.data.message,
            offset: {
              x: 50, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
              y: 10 // vertical axis - can be a number or a string indicating unity. eg: '2em'
            },
          }).showToast();
          setTimeout(() => {
            window.location.href='/assessment'
          }, 1000);
    } catch (error) {
        Toastify({
            text: error.response.data.message,
            offset: {
              x: 50, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
              y: 10 // vertical axis - can be a number or a string indicating unity. eg: '2em'
            },
          }).showToast();
    }
}