// ================================
// Puerto
// ================================

process.env.PORT = process.env.PORT || 3000;

// ================================
// Entorno
// ================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================
// BBDD
// ================================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ================================
// Vencimiento del token
// ================================
// 60 segundos 
// * 60 minutos
// * 24 h 
// * 30 dias
process.env.CADUCIDAD_TOKEN = '48h';


// ================================
// Seed del token
// ================================
process.env.SEED = process.env.SEED || 'Hackea-esto-sacomierda';


// ================================
// Google client_id
// ================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '847485067662-6a9mg30k0nev9tv6bsm9nq439op4c0tc.apps.googleusercontent.com';