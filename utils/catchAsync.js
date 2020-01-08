// For easy use of try and catch block
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
