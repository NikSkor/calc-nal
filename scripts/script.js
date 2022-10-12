const navigationLinks = document.querySelectorAll('.navigation__link');
const calcElems = document.querySelectorAll('.calc')

navigationLinks.forEach((elem) => {
  elem.addEventListener('click', (e) => {
    e.preventDefault();
    navigationLinks.forEach((elem) => {
      elem.classList.remove('navigation__link_active');
    });

    calcElems.forEach((calcElem) => {
      if (elem.dataset.tax === calcElem.dataset.tax){
        calcElem.classList.add('calc_active');
        elem.classList.add('navigation__link_active');
      } else {
        calcElem.classList.remove('calc_active');
      }
    });
  });
});

// for (let i = 0; i < navigationLinks.length; i++) {+
//   navigationLinks[i].addEventListener('click', (e) => {
//     e.preventDefault();
//     for (let j = 0; j < calcElems.length; j++) {
//       if (navigationLinks[i].dataset.tax === calcElems[j].dataset.tax){
//         calcElems[j].classList.add('calc_active');
//         navigationLinks[j].classList.add('navigation__link_active');
//       } else {
//         calcElems[j].classList.remove('calc_active');
//         navigationLinks[j].classList.remove('navigation__link_active');
//       }
//     }
//   })
// }

// АУСН

const ausn = document.querySelector('.ausn');
const formAusn = ausn.querySelector('.calc__form');
const resultTaxTotal = ausn.querySelector('.result__tax_total');
const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

calcLabelExpenses.style.display = 'none';

formAusn.addEventListener('input', () => {
  if(formAusn.type.value === 'income') {
    calcLabelExpenses.style.display = 'none';
    resultTaxTotal.textContent = formAusn.income.value * 0.08
    formAusn.expenses.value = '';
  }

  if(formAusn.type.value === 'expenses') {
    calcLabelExpenses.style.display = 'block';
    resultTaxTotal.textContent = ((formAusn.income.value - formAusn.expenses.value) * 0.2).toFixed(2);
  }
});

// Самозанятый + ИП НПД

const selfEmployment = document.querySelector('.self-employment');
const formSelfEmployment = selfEmployment.querySelector('.calc__form');
const resultTaxTotalSelfEmployment = selfEmployment.querySelector('.result__tax_total');

formSelfEmployment.addEventListener('input', () => {
  resultTaxTotalSelfEmployment.textContent = ((formSelfEmployment.psysicalPerson.value * 0.04)
    + (formSelfEmployment.legalPerson.value * 0.06)).toFixed(2);
});




