class Validation {
    constructor(reg) {
      this.reg = reg;
    }
  
    chkErr(data) {
      return this.reg.test(data);
    }
  
    showErr(input, contentErr) {
      input.classList.add("input-error");
      const errorMsg = input.parentElement.querySelector(".errMessage");
      if (errorMsg) {
        errorMsg.style.visibility = "visible";
        errorMsg.textContent = contentErr;
      }
    }
  
    hideErr(input) {
      input.classList.remove("input-error");
      const errorMsg = input.parentElement.querySelector(".errMessage");
      if (errorMsg) {
        errorMsg.style.visibility = "hidden";
      }
    }
}
  
export default Validation;  