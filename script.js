const currentSelections = {
    labor: null,
    tax: null,
    medical: null,
    education: null,
    laborPop: null,
    middlePop: null,
    capitalGain: null,
    middleCompany: null,
    capitalCompany: null

  };
  
  function setupToggleButtons(id, key) {
    const container = document.getElementById(id);
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSelections[key] = btn.dataset.value;
        calculateTax();
      });
    });
  }
  
  // 初始化所有切換按鈕
  setupToggleButtons('labor-toggle', 'labor');
  setupToggleButtons('tax-toggle', 'tax');
  setupToggleButtons('medical-toggle', 'medical');
  setupToggleButtons('education-toggle', 'education');
  setupToggleButtons('labor-population-toggle', 'laborPop');
  setupToggleButtons('middle-population-toggle', 'middlePop');
  setupToggleButtons('capital-gain-toggle', 'capitalGain');
  setupToggleButtons('middle-company-toggle', 'middleCompany');
  setupToggleButtons('capital-company-toggle', 'capitalCompany');

  
  function calculateTax() {
    const lp = parseInt(currentSelections.laborPop) || 0;
    const mp = parseInt(currentSelections.middlePop) || 0;
    const gainRange = currentSelections.capitalGain || "";
    const laborPolicy = currentSelections.labor;
    const taxPolicy = currentSelections.tax;
    const medicalPolicy = currentSelections.medical;
    const educationPolicy = currentSelections.education;
    const middleCompany = parseInt(currentSelections.middleCompany) || 0;
    const capitalCompany = parseInt(currentSelections.capitalCompany) || 0;
  
    const varMap = { a: 2, b: 1, c: 0 };
    const 基礎稅賦變數 = { a: 3, b: 2, c: 1 };
    const 稅賦變化變數 = { a: 2, b: 1, c: 0 };
  
    const medVar = varMap[medicalPolicy] ?? 0;
    const eduVar = varMap[educationPolicy] ?? 0;
    const taxBase = 基礎稅賦變數[taxPolicy] ?? 0;
    const taxChange = 稅賦變化變數[taxPolicy] ?? 0;
    const 稅賦乘數 = taxBase + taxChange * (medVar + eduVar);
  
    // 勞工稅額表格
    const laborTaxRates = {
      a: { a: 7, b: 6, c: 5 },
      b: { a: 4, b: 4, c: 4 },
      c: { a: 1, b: 2, c: 3 }
    };
  
    // 中產人頭稅表格
    const middleTaxRates = {
      a: { a: 7, b: 6, c: 5 },
      b: { a: 4, b: 4, c: 4 },
      c: { a: 1, b: 2, c: 3 }
    };
  
    // 資本利得稅表格（依據政策 ABC）
    const capitalTaxTable = {
      "5-9":      { a: 1,   b: 2,   c: 2 },
      "10-24":    { a: 5,   b: 5,   c: 4 },
      "25-49":    { a: 12,  b: 10,  c: 7 },
      "50-99":    { a: 24,  b: 15,  c: 10 },
      "100-199":  { a: 40,  b: 30,  c: 20 },
      "200-299":  { a: 100, b: 70,  c: 40 },
      "300+":     { a: 160, b: 120, c: 60 },
    };
  
    // 勞工稅額
    let laborTax = "$0";
    if (lp > 0 && laborPolicy && taxPolicy) {
      const rate = laborTaxRates[laborPolicy][taxPolicy];
      laborTax = `$${(lp * rate).toFixed(0)}`;
    }
  
    // 中產稅額（人頭稅 + 公司稅）
    let middleTax = "$0";
    if (laborPolicy && taxPolicy) {
      const headTax = middleTaxRates[laborPolicy][taxPolicy];
      const companyTax = middleCompany * 稅賦乘數;
      middleTax = `$${(mp * headTax + companyTax).toFixed(0)}`;
    }
  
    // 資本稅額（利得稅 + 公司稅）
    const capitalBaseTax = capitalTaxTable[gainRange]?.[taxPolicy] || 0;
    const capitalCompanyTax = capitalCompany * 稅賦乘數;
    const capitalTax = (capitalBaseTax + capitalCompanyTax) > 0
      ? `$${(capitalBaseTax + capitalCompanyTax)}`
      : "$0";
  
    // 顯示稅額
    document.getElementById("laborResult").innerText = laborTax;
    document.getElementById("middleResult").innerText = middleTax;
    document.getElementById("capitalResult").innerText = capitalTax;
  }
  