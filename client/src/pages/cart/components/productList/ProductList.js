import React, { useContext, useState, useEffect } from 'react';
import { Container, Form, Col, Row, Button } from 'react-bootstrap';
import { MainHeading, Heading2, Heading1, LinkButton, Heading3 } from '../../../../components';
import CartContext from '../../../../contexts/cart';
import UserContext from '../../../../contexts/user';
import api from '../../../../api';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useForm } from "react-hook-form";

import './ProductList.scss';

function ProductList(props) {

    const user = useContext(UserContext);
    const cart = useContext(CartContext);
    const [cost, setCost] = useState(0);

    const [cartProducts, setCartProducts] = useState([]);

    const [loading, setLoading] = useState(false);


    const removeCartItem = async (key) => {
        if (loading) return;
        const response = await fetch(`${api}/cart/removeItem?key=${key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,

            body: JSON.stringify({
                cart_products: cart.cartObj
            })
        });
        const content = await response.json();
        cart.setCart(content.data);
    }

    const addCartItem = async (key) => {
        if (loading) return;
        const response = await fetch(`${api}/cart/addItem?key=${key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,

            body: JSON.stringify({
                cart_products: cart.cartObj
            })
        });
        const content = await response.json();
        cart.setCart(content.data);
    }

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/cart/getCart`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
                cart.setCart(content.data);
            })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        let lst = [];
        let i = 0;
        if (user.userState) {
            for (const [key, value] of Object.entries(cart.cartObj)) {
                if (value?.user_id === user.userState._id) {
                    lst.push(value);
                    lst[i].key = key;
                    i += 1;
                }
            }
        }
        setCartProducts(lst);

    }, [cart, user])



    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountedCost, setDiscountedCost] = useState(0);

    useEffect(() => {
        let totalPrice = 0;
        for (var i = 0; i < cartProducts.length; i++) {
            let element = cartProducts[i];
            if (element?.discountedPrice) {
                totalPrice += element.discountedPrice * element.quantity;
            }
            else {
                totalPrice += element?.price * element?.quantity;
            }
        }


        let d_cost = 0;

        if (appliedCoupon) {
            if (!appliedCoupon?.appliedToProducts) {

                if (appliedCoupon?.type === 'Percentage') {
                    d_cost = totalPrice - (totalPrice * appliedCoupon.percent_off / 100);
                }
                else if (appliedCoupon?.type === 'Fixed Amount') {
                    d_cost = totalPrice - appliedCoupon.amount_off;
                }
            }
        }

        setDiscountedCost(d_cost);
        setCost(totalPrice);

    }, [cartProducts, appliedCoupon])


    const { register, handleSubmit, formState: { errors }, } = useForm();


    const [wrongPromo, setWrongPromo] = useState(false);
    const [correctPromo, setCorrectPromo] = useState(false);
    const [promoCode, setPromoCode] = useState('');


    const onSubmit = async (data) => {

        setLoading(true);

        const response = await fetch(`${api}/cart/coupon-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,

            body: JSON.stringify({
                promoCode: data.promoCode,
                order_cost: cost,
                user_id: user?.userState?._id
            })
        });

        const content = await response.json();

        if (content.success) {
            setPromoCode(data.promoCode);
            setCorrectPromo(true);
            setWrongPromo(false);
            setAppliedCoupon(content.coupon);
        }

        else {
            setWrongPromo(true);
            setCorrectPromo(false);
        }

        if (content.appliedToProducts) {
            cart.setCart(content.data);
        }

        setLoading(false);
    }

    return (
        <Container fluid className="product-list-back">
            {cartProducts.length > 0 ?
                (<div>
                    <Container className="product-list">
                        {
                            cartProducts?.map((element, index) => {

                                return (
                                    <div className="cart-list-item" key={`${element?.key}-${index}`}>
                                        <Row className="product-row">
                                            <Col md={3}>
                                                <img src={element?.default_image} alt={element?.name} />
                                            </Col>
                                            <Col md={5}>
                                                <div className="vertical-top-relative">
                                                    <div style={{ textIndent: '0' }}>

                                                        <Heading2
                                                            link=""
                                                            first={element?.name}
                                                            classes="text-uppercase font-bold"
                                                        />

                                                        <Heading3
                                                            first={`Color: ${element?.color?.name}`}
                                                            classes="margin-bottom-0"
                                                        />

                                                        <Heading3
                                                            first={`Size: ${element?.size?.name}`}
                                                            classes="margin-bottom-0"
                                                        />

                                                        <div style={{ fontSize: '1.3rem' }} className="add-remove-icons">
                                                            <RemoveIcon onClick={() => { removeCartItem(element?.key) }} className="cart-icon" />
                                                            <div style={{ display: 'inline', marginLeft: '0.5rem', marginRight: '0.4rem' }}>{element?.quantity}</div>
                                                            <AddIcon onClick={() => { addCartItem(element?.key) }} className="cart-icon" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col >
                                                <div className="vertical-top-relative" style={{ marginLeft: '4rem' }}>
                                                    {
                                                        element?.discountedPrice ?
                                                            <>
                                                                <Heading2
                                                                    bold={`PKR.${(element?.price) * element?.quantity}`}
                                                                    classes={`text-uppercase text-center striked`}
                                                                    link=""
                                                                />
                                                                <Heading2
                                                                    bold={`PKR.${(element?.discountedPrice) * element?.quantity}`}
                                                                    classes={`text-uppercase text-center`}
                                                                    link=""
                                                                />
                                                            </> :
                                                            <Heading2
                                                                bold={`PKR.${(element?.price) * element?.quantity}`}
                                                                classes={`text-uppercase text-center`}
                                                                link=""
                                                            />
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                        <hr />
                                    </div>
                                );
                            })
                        }
                    </Container>



                    <div>
                        <Form onSubmit={handleSubmit(onSubmit)} className="form-style margin-global-top-2">
                            <Row className="justify-content-center">
                                <Form.Group as={Col} md={4} controlId="promoCode">
                                    <Form.Label style={{ textAlign: 'center' }} >Enter Promotion Code</Form.Label>
                                    <Form.Control
                                        {...register("promoCode", {
                                            required: true,
                                        })}
                                        type="text" />
                                    <div className="error-text">{errors.promoCode && errors.promoCode.type === "required" && <span>Promo Code is required</span>}</div>
                                    <div className="error-text">{wrongPromo && <p>Invalid Promotion Code</p>}</div>
                                </Form.Group>
                            </Row>

                            {cost > 0 && user?.userState._id &&
                                <div style={{ marginTop: '1.5rem' }} className="center-container">
                                    <Button disabled={loading || appliedCoupon != null} className="yesno-button center-child" variant="custom" type="submit" >
                                        Apply
                                    </Button>
                                </div>
                            }

                            {correctPromo &&
                                <div style={{ textAlign: 'center', marginTop: '3rem' }} >
                                    <Heading3
                                        first={`Applied promo code: ${promoCode}`}
                                    />
                                </div>
                            }
                        </Form>

                    </div>

                    <div className="margin-global-top-3" />
                    <Row>
                        {
                            discountedCost > 0 ?
                                <>
                                    <MainHeading
                                        text={`Total Cost: PKR.${cost}`}
                                        classes="text-uppercase text-center striked"
                                    />
                                    <MainHeading
                                        text={`Total Cost: PKR.${discountedCost}`}
                                        classes="text-uppercase text-center"
                                    />
                                </>
                                :
                                <MainHeading
                                    text={`Total Cost: PKR.${cost}`}
                                    classes="text-uppercase text-center"
                                />
                        }

                    </Row>
                    <div className="margin-global-top-3" />
                    <Row>
                        <div className="horizontal-center-margin">
                            {!loading &&
                                <LinkButton
                                    onClick={() => { }}
                                    classes="text-uppercase product-card-size"
                                    text={"Proceed"}
                                    button={false}
                                    to={"/cart/delivery-info"}
                                />
                            }

                        </div>
                    </Row>

                </div>) : (
                    <div style={{ textAlign: 'center' }}>
                        <Heading1
                            first="Cart"
                            bold="is empty"
                            classes="text-uppercase"
                        />
                    </div>)
            }
        </Container>
    );
}

export default ProductList;