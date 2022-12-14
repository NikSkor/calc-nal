// const formatCurrency = (number) => {
//   const currency = new Intl.NumberFormat('ru-RU', {
//     style: 'currency',
//     currency: 'RUB',
//     maximumFractionDigits: 2,
//   });

//   return currency.format(number);
// }

const formatCurrency = number =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(number);

const debounceTimer = (fn, msec) => {
  let lastCall = 0;
  let lastCallTimer = NaN;
  return (...args) => {
    const previousCall = lastCall;
    lastCall = Date.now();

    if(previousCall && ((lastCall - previousCall) <= msec)) {
      clearTimeout(lastCallTimer);
    }

    lastCallTimer = setTimeout( ()=> {
      fn(...args);
    }, msec)
  }
}

//Навигация
{
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
}

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
{
  const ausn = document.querySelector('.ausn');
  const formAusn = ausn.querySelector('.calc__form');
  const resultTaxTotal = ausn.querySelector('.result__tax_total');
  const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');
  const btnClear = ausn.querySelector('.calc__btn-reset');

  calcLabelExpenses.style.display = 'none';

  formAusn.addEventListener('input', debounceTimer(() => {
    const income = +formAusn.income.value;
    if(formAusn.type.value === 'income') {
      calcLabelExpenses.style.display = 'none';
      resultTaxTotal.textContent = formatCurrency(income * 0.08);
      formAusn.expenses.value = '';
    }

    if(formAusn.type.value === 'expenses') {
      const expenses = +formAusn.expenses.value;
      const profit = income < expenses ? 0 : income - expenses;
      calcLabelExpenses.style.display = '';
      resultTaxTotal.textContent = formatCurrency(profit * 0.2);
    }
  }, 500));

  btnClear.addEventListener('click', () => {
    formAusn.reset();
    resultTaxTotal.textContent = formatCurrency(0);
    calcLabelExpenses.style.display = 'none';
  })
};


// Самозанятый + ИП НПД
{
  const selfEmployment = document.querySelector('.self-employment');
  const formSelfEmployment = selfEmployment.querySelector('.calc__form');
  const resultTaxTotalSelfEmployment = selfEmployment.querySelector('.result__tax_total');
  const calcCompensation = selfEmployment.querySelector('.calc__label_compensation');
  const resultBlockCompensation = selfEmployment.querySelectorAll('.result__block_compensation');
  const btnClear = selfEmployment.querySelector('.calc__btn-reset');

  const resultTaxCompensation = selfEmployment.querySelector('.result__tax_compensation');
  const resultTaxRestCompensation = selfEmployment.querySelector('.result__tax_rest-compensation');
  const resultTaxResult = selfEmployment.querySelector('.result__tax_result');

  const checkCompensation = () => {
    const setDisplay = formSelfEmployment.addCompensation.checked
      ? ''
      : 'none';
    calcCompensation.style.display = setDisplay;

    if (!formSelfEmployment.addCompensation.checked) {
      formSelfEmployment.compensation.value = '';
    }

    resultBlockCompensation.forEach((elem) => {
      elem.style.display = setDisplay;
    })
  }

  checkCompensation();

  formSelfEmployment.addEventListener('input', debounceTimer(() => {
    const psysicalPerson = +formSelfEmployment.psysicalPerson.value;
    const legalPerson = +formSelfEmployment.legalPerson.value;

    const resPsysicalPerson = psysicalPerson * 0.04;
    const resLegalPerson = legalPerson * 0.06;

    checkCompensation();

    const tax = resPsysicalPerson + resLegalPerson;
    formSelfEmployment.compensation.value =
      +formSelfEmployment.compensation.value > 10_000
      ? 10_000
      : +formSelfEmployment.compensation.value;

    const benefit = +formSelfEmployment.compensation.value;
    const resBenefit = psysicalPerson * 0.01
      + legalPerson * 0.02;
    const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
    const finalTax = tax - (benefit - finalBenefit);

    resultTaxTotalSelfEmployment.textContent = formatCurrency(tax);

    resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
    resultTaxRestCompensation.textContent = formatCurrency(finalBenefit);
    resultTaxResult.textContent = formatCurrency(finalTax);

  }, 500));

  btnClear.addEventListener('click', () => {
    formSelfEmployment.reset();

    resultTaxTotalSelfEmployment.textContent = formatCurrency(0);

    resultTaxCompensation.textContent = formatCurrency(0);
    resultTaxRestCompensation.textContent = formatCurrency(0);
    resultTaxResult.textContent = formatCurrency(0);
    checkCompensation();
  });
};


// ОСНО
{
  const osno = document.querySelector('.osno');
  const formOsno = osno.querySelector('.calc__form');
  const btnClear = osno.querySelector('.calc__btn-reset');

  const ndflExpenses = osno.querySelector('.result__block_ndfl-expenses');
  const ndflIncome = osno.querySelector('.result__block_ndfl-income');
  const profit = osno.querySelector('.result__block_profit');

  resultTaxNds = osno.querySelector('.result__tax_nds');
  resultTaxProperty = osno.querySelector('.result__tax_property');
  resultTaxNdflExpenses = osno.querySelector('.result__tax_ndfl-expenses');
  resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
  resultTaxProfit = osno.querySelector('.result__tax_profit');

  const checkFormBusiness = () => {
    if (formOsno.formBusiness.value === 'ИП') {
      ndflExpenses.style.display = '';
      ndflIncome.style.display = '';
      profit.style.display = 'none';
    }

    if (formOsno.formBusiness.value === 'ООО') {
      ndflExpenses.style.display = 'none';
      ndflIncome.style.display = 'none';
      profit.style.display = '';
    }
  };

  checkFormBusiness();

  formOsno.addEventListener('input', debounceTimer(() => {
    checkFormBusiness();

    const income = +formOsno.income.value;
    const expenses = +formOsno.expenses.value;
    const property = +formOsno.property.value;

    //Доход
    const profit = income < expenses ? 0 : income - expenses;
    //НДС
    const nds = income * 0.2;
    //налог на имущество
    const taxProperty = property * 0.02;
    //НДФЛ(вычет в виде расходов)
    const ndflExpensesTotal = profit * 0.13; 
    //НДФЛ(вычет 20% от доходов)
    const NdflIncomeTotal = (income - nds) * 0.13;
    //Налог на прибыль ООО 20%
    const taxProfit = profit * 0.2;


    resultTaxNds.textContent = formatCurrency(nds);
    resultTaxProperty.textContent = formatCurrency(taxProperty);
    resultTaxNdflExpenses.textContent = formatCurrency(ndflExpensesTotal);
    resultTaxNdflIncome.textContent = formatCurrency(NdflIncomeTotal);
    resultTaxProfit.textContent = formatCurrency(taxProfit);
  }, 500));

  btnClear.addEventListener('click', () => {
    formOsno.reset();
    checkFormBusiness();
    resultTaxNds.textContent = formatCurrency(0);
    resultTaxProperty.textContent = formatCurrency(0);
    resultTaxNdflExpenses.textContent = formatCurrency(0);
    resultTaxNdflIncome.textContent = formatCurrency(0);
    resultTaxProfit.textContent = formatCurrency(0);
  })
};

//УСН
{
  const LIMIT = 300_000;
  const usn = document.querySelector('.usn');
  const formUsn = usn.querySelector('.calc__form');
  const btnClear = usn.querySelector('.calc__btn-reset');

  const calcLabelExpenses = usn.querySelector('.calc__label_expenses');
  const calcLabelProperty = usn.querySelector('.calc__label_property');
  const resultBlockProperty = usn.querySelector('.result__block_property');

  const resultTaxTotal = usn.querySelector('.result__tax_total');
  const resultTaxProperty = usn.querySelector('.result__tax_property');

  const checkShopProperty = (typeTax) => {
    switch (typeTax) {
      case 'income': {
        calcLabelExpenses.style.display = 'none';
        calcLabelProperty.style.display = 'none';
        resultBlockProperty.style.display = 'none';

        formUsn.expenses.value = '';
        formUsn.property.value = '';
        break;
      };
      case 'ip-expenses': {
        calcLabelExpenses.style.display = '';
        calcLabelProperty.style.display = 'none';
        resultBlockProperty.style.display = 'none';

        formUsn.property.value = '';
        break;
      };
      case 'ooo-expenses': {
        calcLabelExpenses.style.display = '';
        calcLabelProperty.style.display = '';
        resultBlockProperty.style.display = '';
        break;
      };
    }
  }
  //? Другой вариант
  // const typeTax = {
  //   'income': () => {
  //     calcLabelExpenses.style.display = 'none';
  //     calcLabelProperty.style.display = 'none';
  //     resultBlockProperty.style.display = 'none';

  //     formUsn.expenses.value = '';
  //     formUsn.property.value = '';
  //   },
  //   'ip-expenses': () => {
  //     calcLabelExpenses.style.display = '';
  //     calcLabelProperty.style.display = 'none';
  //     resultBlockProperty.style.display = 'none';

  //     formUsn.property.value = '';
  //   },
  //   'ooo-expenses': () => {
  //     calcLabelExpenses.style.display = '';
  //     calcLabelProperty.style.display = '';
  //     resultBlockProperty.style.display = '';
  //   }
  // }
  // typeTax[formUsn.typeTax.value]();

  const percent = {
    'income': 0.06,
    'ip-expenses': 0.15,
    'ooo-expenses': 0.15,
  }

  checkShopProperty(formUsn.typeTax.value);
  formUsn.addEventListener('input', debounceTimer(() => {
    checkShopProperty(formUsn.typeTax.value);

    const income = +formUsn.income.value;
    const expenses = +formUsn.expenses.value;
    const contributions = +formUsn.contributions.value;
    const property = +formUsn.property.value;

    let profit = income - contributions;

    if(formUsn.typeTax.value != 'income') {
      profit -= expenses;
    }
    
    const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;

    const summ = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);

    const tax = summ * percent[formUsn.typeTax.value];

    const taxProperty = property * 0.02;

    resultTaxTotal.textContent = formatCurrency(tax < 0 ? 0 : tax);
    resultTaxProperty.textContent = formatCurrency(taxProperty);
  }, 500));

  btnClear.addEventListener('click', () => {
    formUsn.reset();
    checkShopProperty(formUsn.typeTax.value);
    resultTaxTotal.textContent = formatCurrency(0);
    resultTaxProperty.textContent = formatCurrency(0);
  })
};

//Налоговый вычет 13%
{
  const taxReturn = document.querySelector('.tax-return');
  const formTaxReturn = taxReturn.querySelector('.calc__form');
  const btnClear = taxReturn.querySelector('.calc__btn-reset');

  const resultTaxNdfl = taxReturn.querySelector('.result__tax_ndfl');
  const resultTaxPossible = taxReturn.querySelector('.result__tax_possible');
  const resultTaxDeduction = taxReturn.querySelector('.result__tax_deduction');

  formTaxReturn.addEventListener('input', debounceTimer(()=> {
    const expenses = +formTaxReturn.expenses.value;
    const income = +formTaxReturn.income.value;
    const sumExpenses = +formTaxReturn.sumExpenses.value;

    const ndfl = income * 0.13;
    const possibleDeduction = expenses < sumExpenses
      ? expenses * 0.13
      : sumExpenses * 0.13;
    const deduction = possibleDeduction < ndfl ? possibleDeduction : ndfl; 

    resultTaxNdfl.textContent = formatCurrency(ndfl);
    resultTaxPossible.textContent = formatCurrency(possibleDeduction);
    resultTaxDeduction.textContent = formatCurrency(deduction);
  }, 500));

  btnClear.addEventListener('click', () => {
    formTaxReturn.reset();
    resultTaxNdfl.textContent = formatCurrency(0);
    resultTaxPossible.textContent = formatCurrency(0);
    resultTaxDeduction.textContent = formatCurrency(0);
  })
};
