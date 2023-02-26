


const accessment_form = document.getElementById('accessment_form')
const submit_btn = document.querySelector('.submit_btn')
const all_quiz = document.getElementById('all_quiz')
const accessment_container = document.querySelector('.accessment_container')
const apicall = async () => {
    try {
        const res = await axios.get('/assessment/quiz')
        let count = 0
        quizUiShow(res.data,count)
        let arr = []
        submit_btn.onclick = async event => {
            const selectedOption = document.querySelector('input[name="fav_language"]:checked')
            const question = document.querySelector('.question').id
            arr = [...arr,{questionId:question,selectedOption:selectedOption?.id}]
            if(count === res.data.length -1) {
                const res = await axios.post('/post_assessment/quiz',arr)
                if(res.status === 200){
                  window.location.href = '/result'
                }
            }else {
                count++
                quizUiShow(res.data,count)
            }
        }
    } catch (error) {
        console.log(error)
    }
}

apicall()
function quizUiShow (data,count) {
    const e = data[count]
    const quiz = `
          <h2 id='${e.id}' class='question' > ${e.question}? </h2>
          <div class="radio_field">
            <input type="radio"  name="fav_language" id="${e.option[0].id}" value="${e.option[0].value}" />
            &nbsp;
            <label for="html"> ${e.option[0].value} </label><br />
          </div>
          <div class="radio_field">
            <input type="radio"  name="fav_language" id="${e.option[1].id}" value="${e.option[1].value}" />
            &nbsp;
            <label for="html"> ${e.option[1].value} </label><br />
          </div>
          <div class="radio_field">
          <input type="radio"  name="fav_language" id="${e.option[2].id}" value="${e.option[2].value}" />
          &nbsp;
          <label for="html"> ${e.option[2].value} </label><br />
        </div>
        <div class="radio_field">
        <input type="radio"  name="fav_language" id="${e.option[3].id}" value="${e.option[3].value}" />
        &nbsp;
        <label for="html"> ${e.option[3].value} </label><br />
      </div>
    `
    all_quiz.innerHTML = quiz
}
