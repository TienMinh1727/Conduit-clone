import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import agent from '../../agent';
import { Status } from '../../common/utils';

export const getAllTags = createAsyncThunk('tags/getAllTags', async () => {
  const { tags } = await agent.Tags.getAll();

  return tags;
});

const initialState = {
  status: Status.IDLE,
  tags: [],
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllTags.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(getAllTags.fulfilled, (_, action) => ({
        status: Status.SUCCESS,
        tags: action.payload,
      }));
  },
});

const selectTagsState = (state) => state.tags;

export const selectTags = (state) => selectTagsState(state).tags;

export const selectIsLoading = (state) =>
  selectTagsState(state).status === Status.LOADING;

export default tagsSlice.reducer;
