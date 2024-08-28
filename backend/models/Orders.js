import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true,
  collection: 'orders'
});

// Aggiunge un metodo al modello per aggiornare un item
OrderSchema.methods.updateItem = function(itemId, newQuantity) {
  const item = this.items.id(itemId);
  if (item) {
    item.quantity = newQuantity;
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
};

// Aggiunge un metodo al modello per rimuovere un item
OrderSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => item._id.toString() !== itemId);
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export default mongoose.model("Orders", OrderSchema);