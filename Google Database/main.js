const main = () => {
  installOwnerTriggers();
  Object.values(CAMPUSES).forEach(campus => {
  createSignUpForm(campus);
});
}