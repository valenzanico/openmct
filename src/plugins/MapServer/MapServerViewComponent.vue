/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2020, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

<template>
<div style="
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
">
    <div class="">
        <label for="longitude">
            <div class="c-labeled-input__label">Longitude</div>
        </label>
        <input
            id="longitude"
            v-model="input.lon"
            type="text"
        >
        <label for="latitude">
            <div class="c-labeled-input__label">Latitude</div>
        </label>
        <input
            id="latitude"
            v-model="input.lat"
            type="text"
        >
        <button
            class="c-button c-button--major"
            @click="zoomMap()"
        >
            GO
        </button>
        <div
            v-if="hasLastPoint"
        >
            Layer: {{ lastPoint.layerName }} - Longitude, Latitude {{ lastPoint.lon }}deg, {{ lastPoint.lat }}deg
        </div>
    </div>
    <div
        class="l-iframe"
        style="
            height: 100%;
            width: auto;
        "
    >
        <iframe
            :src="domainObject.url"
            :name="domainObject.id"
        ></iframe>
    </div>
</div>
</template>

<script>
export default {
    inject: ['openmct'],
    props: {
        domainObject: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            input: {
                layerName: '',
                lon: '',
                lat: ''
            },
            lastPoint: {
                layerName: undefined,
                lon: undefined,
                lat: undefined
            }
        };
    },
    computed: {
        hasLastPoint() {
            return this.lastPoint.layerName !== undefined
                && this.lastPoint.lon !== undefined
                && this.lastPoint.lat !== undefined;
        }
    },
    destroyed() {
        window.removeEventListener('message', this.handleMessage);
    },
    mounted() {
        let mmgis = window.frames[this.domainObject.id];

        window.addEventListener('message', this.setLastPoint);
    },
    methods: {
        zoomMap() {
            this.postMessage(this.input);
        },
        setLastPoint(event) {
            const { origin, data } = event;
            const { layerName, lon, lat } = data;

            if (origin !== this.domainObject.url) {
                console.warn(`Message received from unknown origin: ${origin}`);
            }

            this.lastPoint = Object.assign(
                {},
                this.lastPoint,
                {
                    layerName: layerName,
                    lon: lon,
                    lat: lat
                }
            );
        },
        postMessage(message) {
            const target = window.frames[this.domainObject.id];

            // target.postMessage(message, this.domainObject.url);
            target.postMessage(message, '*');
},
        clearLastPoint() {
            this.lastPoint.layerName = undefined;
            this.lastPoint.lon = undefined;
            this.lastPoint.lat = undefined;
        }
    }
};
</script>
