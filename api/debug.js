module.exports = function handler(req, res) {
  res.status(200).json({
    has_anthropic: !!process.env.Anthropic,
    key_prefix: process.env.Anthropic ? process.env.Anthropic.trim().slice(0, 10) + '...' : 'ABSENT',
  });
}
