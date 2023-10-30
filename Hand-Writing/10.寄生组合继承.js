function Parent(name) {
  this.name = name;
}

Parent.prototype.sayHi = function () {
  console.log(this.name);
};

function Son(name, age) {
  Parent.call(this, name);
  this.age=age
}

Son.prototype = Object.create(Parent.prototype);
Son.prototype.constructor = Son;
