// Token counter for tracking API usage

const countTokens = (text) => {
  if (!text) return 0;
  // Rough estimation: ~4 chars per token
  return Math.ceil(text.length / 4);
};

const estimateTokensForMessage = (message) => {
  let tokens = 0;
  
  if (message.message_text) {
    tokens += countTokens(message.message_text);
  }
  
  if (message.attachments && Array.isArray(message.attachments)) {
    tokens += message.attachments.length * 100; // Rough estimate for attachments
  }
  
  return tokens;
};

const estimateTokensForQuotation = (quotation) => {
  let tokens = 0;
  
  tokens += countTokens(JSON.stringify(quotation.items));
  tokens += countTokens(quotation.notes || '');
  
  return tokens;
};

module.exports = {
  countTokens,
  estimateTokensForMessage,
  estimateTokensForQuotation
};
