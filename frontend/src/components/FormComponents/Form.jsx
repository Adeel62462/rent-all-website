import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import TextInput from './TextInput'
import Pic from './Pic';
import LoginContext from '../../Context/LoginContext';
import ItemListContext from '../../Context/ItemListContext';

export default function Form(props) {    
    const [login, setLogin] = useContext(LoginContext);
    const {itemList} = useContext(ItemListContext);
    const category = props.category;
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        priceType: "",
        state: "",
        city: "",
        phone: "",
        images: []
    });
    const [haveImages, setHaveImages] = useState(false);
    const [itemId, setItemId] = useState("");

    function updateFormData(event) {
        const { name, value } = event.target;
        setFormData(prevValue => {
            return {
                ...prevValue,
                [name]: value
            };
        });
    }

    function updateImages(object, name) {
        const prevImages = formData.images.filter((image) => image.id !== object.id);
        setHaveImages(false);
        setFormData(prevValue => {
            return {
                ...prevValue,
                [name]: [...prevImages, { id: object.id, image: object.image }]
            };
        });
    }

    async function submitForm(event) {
        event.preventDefault();
        if (formData.images.length === 0) {
            setHaveImages(true);
        } else {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("priceType", formData.priceType);
            data.append("state", formData.state);
            data.append("city", formData.city);
            data.append("category", category);
            data.append("phone", formData.phone);
            data.append("ownerID", login.id);
            data.append("ownerName", login.name);

            for (let i = 0; i < formData.images.length; i++) {
                data.append("images", formData.images[i].image);
            }

            const options = {
                method: "POST",
                body: data
            }
            const response = await fetch("/post/ad", options);
            const result = await response.json();
            if (result) {
                itemList.push(result);
                setItemId(result._id);
            } else {
                alert("Error Occurred! TRY Again !");
            }

        }
    }

    return (
        <form onSubmit={submitForm}>
            <div className="AddDetailsMainDiv">
                <h2 className="AddDetailHeading">
                    <span>SELECTED CATEGORY </span>
                </h2>
                <div className="Boarder"></div>
                <div className="AddDetailDiv">
                    <div className="insideAddDetailDiv ">
                        <h2>
                            <span className="AddDetailFont">
                                INCLUDE SOME DETAILS
                        </span>
                        </h2>
                        <div className="AddTitleDiv">
                            <label>Add title *</label>

                            <TextInput
                                name="title"
                                updateText={updateFormData}
                                value={formData.title}
                            />

                            <div style={{ display: 'flex' }}>
                                <span className="inputMsg">
                                    Mention the key features of your item (e.g. brand, model, age, type)
                            </span>
                            </div>
                        </div>

                        <div className="AddTitleDiv">
                            <label>Add Description *</label>
                            <div className="AddTitleInputDiv">
                                <textarea
                                    onChange={updateFormData}
                                    value={formData.description}
                                    name="description"
                                    className="DescInput"
                                    maxLength="4096"
                                    style={{ height: '96px', resize: 'none' }}
                                    required
                                >
                                </textarea>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <span className="inputMsg">
                                    Include condition, features and reason for selling
                            </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Boarder"></div>

                <div className="AddDetailDiv">
                    <div className="insideAddDetailDiv ">
                        <h2><span className="AddDetailFont">SET A PRICE</span></h2>
                        <div className="AddTitleDiv">
                            <label>Price*</label>
                            <div className="AddTitleInputDiv">
                                <div className="RemainingRsDiv">
                                    <input
                                        onChange={updateFormData}
                                        name="price"
                                        className="inputText"
                                        type="number"
                                        style={{ width: '100%' }}
                                        value={formData.price}
                                        required
                                    ></input>
                                </div>
                            </div>
                            <label>Price criteria*</label>
                            <div className="AddTitleInputDiv">
                                <div className="RemainingRsDiv">
                                    <div className="inputText">
                                        <select required onChange={updateFormData} name="priceType" className="Sele">
                                            <option value="">--Select--</option>
                                            <option value="month">PER MONTH</option>
                                            <option value="week">PER WEEK</option>
                                            <option value="day">PER DAY</option>
                                            <option value="hour">PER HOUR</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Boarder"></div>

                <div className="AddDetailDiv">
                    <div className="insideAddDetailDiv ">
                        <h2><span className="AddDetailFont">UPLOAD UP TO 12 PHOTOS</span></h2>
                        <div aria-disabled="false" style={{ display: 'block' }}>
                            <div className="PicDivup">
                                <ul className="picUl"></ul>
                                {Array(12).fill(null).map((value, index) => {
                                    return (
                                        <Pic
                                            id={index}
                                            updateImageArray={updateImages}
                                        />
                                    );
                                })}
                            </div>
                            <span className="inputMsg">Allowed Formats (JPG, JPEG, PNG)</span>
                            {
                                haveImages && <p className="PicMsg"><span>This field is mandatory</span></p>
                            }
                        </div>
                    </div>
                </div>

                <div className="Boarder"></div>

                <div className="AddDetailDiv">
                    <div className="insideAddDetailDiv ">
                        <h2><span className="AddDetailFont">SET YOUR LOCATION</span></h2>
                        <div className="AddTitleDiv">
                            <label>State*</label>
                            <div className="AddTitleInputDiv">
                                <div className="RemainingRsDiv">
                                    <div className="inputText">
                                        <select required onChange={updateFormData} name="state" className="Sele">
                                            <option value="">--Select--</option>
                                            <option value="Punjab">Punjab</option>
                                            <option value="Sindh">Sindh</option>
                                            <option value="Balochistan">Balochistan</option>
                                            <option value="Kashmir">Kashmir</option>
                                            <option value="KPK">KPK</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <label>City*</label>

                            <TextInput
                                name="city"
                                updateText={updateFormData}
                                value={formData.city}
                            />
                        </div>
                    </div>
                </div>

                <div className="Boarder"></div>

                <div className="AddDetailDiv" style={{ paddingBottom: '2%' }}>
                    <div className="insideAddDetailDiv ">
                        <h2><span className="AddDetailFont">Enter your Phone Number</span></h2>
                        <div className="phoneInputDiv">
                            <div className="phoneCode">+92</div>
                            <div>
                                <input
                                    onChange={updateFormData}
                                    value={formData.phone}
                                    name="phone"
                                    type="number"
                                    placeholder="Phone Number"
                                    className="phoneInput"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Boarder"></div>

                <div className="AddDetailDiv">
                    <div className="insideAddDetailDiv " style={{ paddingBottom:'3%' }}>
                        <div className="loadDiv" >
                            <button
                                type="submit"
                                className="loadBtn"
                                style={{ float: 'left'}}
                            >
                                <span>Post Now</span>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Redirects to Congratulations Page on successful Submission */}
                {
                    itemId && <Redirect push to={"/Congo=>"+itemId} />
                }
            </div>
        </form>
    );
}