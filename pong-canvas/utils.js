let utils = {};

utils.distanceBetween = (obj1, obj2) => {
  // Pythagorean theorem, find shortest dist between the two origins
  let dx = obj1.position.x - obj2.position.x;
  let dy = obj1.position.y - obj2.position.y;
  return Math.sqrt(dx ** 2 + dy ** 2);
};

export default utils;
