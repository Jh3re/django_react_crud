import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { createTask, deleteTask, updateTask, getTask } from "../api/tasks.api";
import { useNavigate, useParams } from "react-router-dom";

export default function TaskFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  const navigate = useNavigate();
  const params = useParams();

  const onSubmit = handleSubmit(async (data) => {
    if (params.id) {
      await updateTask(params.id, data);
    } else {
      await createTask(data);
    }
    navigate("/tasks");
  });

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const {data: {title, description}} = await getTask(params.id);
        setValue('title', title)
        setValue('description', description)
      }
    }
    loadTask();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Title"
          {...register("title", { required: true })}
        />
        {errors.title && <span>The title field is required</span>}
        <textarea
          rows="3"
          placeholder="Description"
          {...register("description", { required: true })}
        ></textarea>
        {errors.description && <span>The description field is required</span>}
        <button> Save </button>
      </form>

      {params.id && (
        <button
          onClick={async () => {
            const agree = window.confirm("Are you sure you want to?");
            if (agree) {
              await deleteTask(params.id);
              navigate("/tasks");
            }
          }}
        >
          {" "}
          Delete{" "}
        </button>
      )}
    </>
  );
}
