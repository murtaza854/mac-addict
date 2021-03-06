import { FormControl, FormControlLabel, Checkbox, Input, InputLabel, FormHelperText, Button, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
import TreeItem from '@mui/lab/TreeItem';
import { useForm, Controller } from "react-hook-form";

const createTableData = (data) => {
    const { _id, name, slug, subCategory, active } = data;
    const subCategoryName = subCategory.name
    const categoryName = subCategory.category.name
    return { _id, name, slug, subCategoryName, categoryName, active };
}

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
    if (obj.type === 'active') {
        const rows = [];
        let active = true;
        if (obj.value === 'in-active') active = false;
        const response = await fetch(`${api}/further-Sub-category/set-active`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({ active: active, selected: selected })
        });
        const content = await response.json();
        content.data.forEach(element => {
            rows.push(createTableData(element));
        });
        setTableRows(rows);
        setOriginalTableRows(rows);
    }
}

// const editObjCheck = (data, value, editObj) => {
//     if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
//     else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
// }

const furtherSubCategoryObj = {
    apiTable: `${api}/further-sub-category/table-data`,
    deleteApi: `${api}/further-sub-category/delete`,
    createTableData: createTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
        { id: 'slug', numeric: false, disablePadding: true, label: 'Slug' },
        { id: 'subCategoryName', numeric: false, disablePadding: false, label: 'Sub category' },
        { id: 'categoryName', numeric: false, disablePadding: false, label: 'Category' },
        { id: 'active', numeric: false, disablePadding: false, label: 'Active' },
    ],
    ManyChild: '',
    checkboxSelection: '_id',
    Delete: function (items) {
        let html = [];
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            console.log(element);
            html.push(
                <TreeItem key={i} nodeId={`${element._id}`} label={element.name}>
                    {element.products.map((childValue, childIndex) => {
                        return <TreeItem key={childIndex} nodeId={`${childValue._id}`} label={childValue.name} />
                    })}
                </TreeItem>
            )
        }
        return html;
    },
    editAllowed: true,
    deleteAllowed: true,
    addAllowed: true,
    modelName: 'Further Sub Category',
    ordering: 'name',
    searchField: 'name',
    rightAllign: [],
    type: 'enhanced',
    startAction: startAction,
    actionOptions: [
        { label: '', value: '', type: '' },
        { label: 'Set active', value: 'active', type: 'active' },
        { label: 'Set in-active', value: 'in-active', type: 'active' }
    ],
    Form: function (id, classes) {
        let history = useHistory();

        let queryID = '';
        if (id != null) queryID = id;
        const [editObj, setEditObj] = useState(null);


        const [furtherSubCategoriesArray, setFurtherSubCategoriesArray] = useState([]);
        const [subCategoriesArray, setSubCategoriesArray] = useState([]);
        const [pressedBtn, setPressedBtn] = useState(null);
        const [loading, setLoading] = useState(true);

        const [defaultName, setDefaultName] = useState('');
        const [defaultSubCategory, setDefaultSubCategory] = useState('');
        const [defaultKeywords, setDefaultKeywords] = useState('');
        const [defaultDescription, setDefaultDescription] = useState('');
        const [defaultActive, setDefaultActive] = useState(true);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/further-sub-category/table-data`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                    });
                    const content = await response.json();
                    const obj = content.data.find(o => o._id === queryID);
                    setEditObj(obj);
                    setFurtherSubCategoriesArray(content.data);
                    setLoading(false);
                })();
        }, [queryID]);

        useEffect(() => {
            (
                async () => {
                    const response = await fetch(`${api}/sub-category/table-data-auto`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store'
                        },
                        credentials: 'include',
                        withCredentials: true,
                        body: JSON.stringify({})
                    });
                    const content = await response.json();
                    setSubCategoriesArray(content.data)
                })();
        }, []);

        useEffect(() => {
            if (editObj) {
                setDefaultName(editObj.name);
                setDefaultSubCategory(editObj.subCategory);
                setDefaultKeywords(editObj.keywords);
                setDefaultDescription(editObj.description);
                setDefaultActive(editObj.active);
            } else {

            }
        }, [editObj]);

        const { register, handleSubmit, formState: { errors }, control, reset } = useForm();


        const onSubmit = async (data) => {
            setLoading(true);
            if (queryID === '') {
                const response = await fetch(`${api}/further-sub-category/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({ name: data.name, subCategory: data.subCategory, keywords: data.keywords, description: data.description, active: data.active }),
                });
                const content = await response.json();
                setFurtherSubCategoriesArray([...furtherSubCategoriesArray, content.data]);
            } else {
                const response = await fetch(`${api}/further-sub-category/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store'
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({ _id: queryID, name: data.name, subCategory: data.subCategory, keywords: data.keywords, description: data.description, active: data.active }),
                });
                const content = await response.json();
                const objArray = [...furtherSubCategoriesArray];
                const index = objArray.findIndex(obj => obj._id === queryID);
                objArray[index] = content.data;
                queryID = '';
                setFurtherSubCategoriesArray(objArray);
            }

            reset();
            if (pressedBtn === 1) {
                if (queryID === '') {
                    history.push({
                        pathname: `/admin/further-sub-category`,
                        state: { data: 'added', name: data.name }
                    });
                } else {
                    history.push({
                        pathname: `/admin/further-Sub-category`,
                        state: { data: 'edited', name: data.name }
                    });
                }
            }

            else {
                setDefaultName('');
                setDefaultSubCategory('');
                setDefaultKeywords('');
                setDefaultDescription('');
                setDefaultActive(true);
                setLoading(false);
                history.push('/admin/further-sub-category/add');
            }
        };
        if (loading) return <div></div>

        return (<Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

            <fieldset>
                <legend>Details</legend>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="name">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={errors.name ? true : false} color="secondary">Name</InputLabel>
                            <Input
                                {...register("name", {
                                    required: "Name is required!",
                                })}
                                defaultValue={defaultName}
                                color="secondary"
                                autoComplete="none"
                                type="text"
                                error={errors.name ? true : false}
                                aria-describedby="name-helper"
                            />
                            {!errors.name &&
                                <FormHelperText id="name-helper">Enter name Ex. Foundation</FormHelperText>
                            }
                            <FormHelperText error={errors.name ? true : false} id="name-helper">{errors.name && <>{errors.name.message}</>}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                    <Form.Group as={Col} md={6} controlId="category">
                        <FormControl className={classes.formControl}>
                            <Controller
                                render={(props) => (
                                    <Autocomplete
                                        defaultValue={editObj ? defaultSubCategory : undefined}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                        id="combo-box-demo"
                                        color="secondary"
                                        options={subCategoriesArray}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(e, data) => props.field.onChange(data)}
                                        renderInput={(params) =>
                                            <TextField
                                                error={errors.subCategory ? true : false}
                                                color="secondary"
                                                {...params}
                                                label="Sub Category"
                                            />
                                        }
                                    />
                                )}
                                rules={{ required: "Sub-Category is required!" }}
                                onChange={([, data]) => data}
                                defaultValue={defaultSubCategory}
                                name={"subCategory"}
                                control={control}
                            />
                            {!errors.subCategory &&
                                <FormHelperText id="name-helper">Select Sub-Category</FormHelperText>
                            }
                            <FormHelperText error={errors.subCategory ? true : false} id="name-helper">{errors.subCategory && <>{errors.subCategory.message}</>}</FormHelperText>

                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="keywords">
                        <FormControl className={classes.formControl}>
                            <InputLabel color="secondary">Keywords</InputLabel>
                            <Input
                                defaultValue={defaultKeywords}
                                color="secondary"
                                autoComplete="none"
                                {...register("keywords", {})}
                                type="text"
                                aria-describedby="keywords-helper"
                            />
                            <FormHelperText id="keywords-helper">Comma seperated SEO Keywords</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
                    <Form.Group controlId="description">
                        <FormControl className={classes.formControl}>
                            <TextField
                                defaultValue={defaultDescription}
                                {...register("description", {})}
                                color="secondary"
                                autoComplete="none"
                                label="Description"
                                multiline
                                rows={10}
                                aria-describedby="description-helper"
                            />
                            <FormHelperText id="description-helper">Type a description for SEO Ex. This category is...</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="name">

                        <FormControlLabel
                            control={
                                <Controller
                                    name={"active"}
                                    control={control}
                                    defaultValue={defaultActive}
                                    render={(props) => (
                                        <Checkbox

                                            checked={props.field.value}
                                            onChange={(e) => props.field.onChange(e.target.checked)}
                                        />
                                    )}
                                />
                            }
                            label={"Active"}
                        />

                    </Form.Group>
                </Row>
            </fieldset>
            <Button className={classes.button} onClick={_ => setPressedBtn(1)} type="submit" variant="contained" color="primary">
                Save
            </Button>
            <Button onClick={_ => setPressedBtn(2)} type="submit" variant="contained" color="primary">
                Save and add another
            </Button>
        </Form>);
    },
}

export default furtherSubCategoryObj;