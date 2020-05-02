var users = require('../../controllers/user/user'); // include user controller ////

module.exports = function (app) {
    
    app.route('/api/user/register').post(users.user_register);
    app.route('/api/user/login').post(users.user_login);
    app.route('/api/user/update').post(users.user_update);
    app.route('/api/user/update_device_token').post(users.update_device_token);
    app.route('/api/user/logout').post(users.logout);
    app.route('/api/user/get_detail').post(users.get_detail);
    app.route('/api/user/get_store_list_nearest_city').post(users.get_store_list_nearest_city);

    
    app.route('/api/user/otp_verification').post(users.user_otp_verification);
    app.route('/api/user/rating_to_provider').post(users.user_rating_to_provider);
    app.route('/api/user/rating_to_store').post(users.user_rating_to_store);
    app.route('/api/user/get_store_list').post(users.get_store_list);
    app.route('/api/user/get_delivery_list_for_nearest_city').post(users.get_delivery_list_for_nearest_city);
    app.route('/api/user/get_order_cart_invoice').post(users.get_order_cart_invoice);
    app.route('/api/user/get_courier_order_invoice').post(users.get_courier_order_invoice);
    app.route('/api/user/pay_order_payment').post(users.pay_order_payment);
    app.route('/api/user/user_get_store_product_item_list').post(users.user_get_store_product_item_list);

    
    app.route('/api/user/add_favourite_store').post(users.add_favourite_store);
    app.route('/api/user/remove_favourite_store').post(users.remove_favourite_store);
    app.route('/api/user/get_order_detail').post(users.get_order_detail);
    app.route('/api/user/get_favourite_store_list').post(users.get_favourite_store_list);
    app.route('/api/user/user_get_store_review_list').post(users.user_get_store_review_list);

    app.route('/api/user/user_like_dislike_store_review').post(users.user_like_dislike_store_review);

    app.route('/api/user/store_list_for_item').post(users.store_list_for_item);
    
    app.route('/api/user/get_orders').post(users.get_orders);
    app.route('/api/user/get_order_status').post(users.get_order_status);
    app.route('/api/user/order_history').post(users.order_history);
    app.route('/api/user/order_history_detail').post(users.order_history_detail);

    app.route('/api/user/get_provider_location').post(users.get_provider_location);
    app.route('/api/user/get_invoice').post(users.get_invoice);
};





