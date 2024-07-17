<template>
  <v-container class="pa-12" fluid>
    <v-row justify="center" align="center" class="">
        <v-col >
            <v-card class="mx-auto px-6 py-8" max-width="960">
                <v-container>
                    <v-row>
                        <v-col>
                            <span class="text-h3 pa-5">Login Form</span>
                            <v-form
                                v-model="form"
                                @submit.prevent="onSubmit"
                                class="pa-5"
                            >
                                <v-text-field
                                v-model="email"
                                :readonly="loading"
                                :rules="[required]"
                                class="mb-2"
                                label="Email"
                                clearable
                                ></v-text-field>

                                <v-text-field
                                v-model="password"
                                :readonly="loading"
                                :rules="[required]"
                                label="Password"
                                placeholder="Enter your password"
                                clearable
                                ></v-text-field>

                                <br>

                                <v-btn
                                :disabled="!form"
                                :loading="loading"
                                color="primary"
                                size="large"
                                type="submit"
                                variant="elevated"
                                block
                                >
                                Sign In
                                </v-btn>
                                <br>

                                <v-checkbox label="Remember Me" v-model="rememberMe"></v-checkbox>
                            </v-form>
                            
                        </v-col>
                        <v-col>
                            <img width="100%" height="100%" src="/public/flat-design-oxygen-tank-illustration.png"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import { ref } from 'vue';

const form =  ref(false);
const email = ref(null);
const password =  ref(null);
const loading = ref(false);
const rememberMe = ref(false);
const checkbox1 = ref(false)
const onSubmit = () => {
        if (!this.form) return

        this.loading = true

        setTimeout(() => (this.loading = false), 2000)
      }
const required = (v) => {
        return !!v || 'Field is required'
      }
</script>