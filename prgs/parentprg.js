module.exports = {
  signup: async (req, res) => {
    res.render(process.env.signupverificationhbspage, {
      layout:"nothing",
      alert: 'check your mail for verification pin',
      posto: '/parent/vpin',
    });
  },
};
